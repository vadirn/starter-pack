// https://github.com/stacktracejs/error-stack-parser/blob/master/error-stack-parser.js

const FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
const CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
const SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code\])?$/;

// Remove undefined values from obj
function shallowCleanup(obj) {
  for (const key of Object.keys(obj)) {
    if (obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}

function normalizeOutput(props) {
  return Object.assign(
    {
      fileName: '<unknown file>',
      functionName: '<unknown function>',
      args: '<arguments not available>',
      lineNumber: '<unknown line>',
      columnNumber: '<unknown column>',
      source: '<unknown source>',
    },
    shallowCleanup(props)
  );
}

export default function parseError(error) {
  if (typeof error.stacktrace !== 'undefined' || typeof error['opera#sourceloc'] !== 'undefined') {
    return parseOpera(error);
  } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
    return parseV8OrIE(error);
  } else if (error.stack) {
    return parseFFOrSafari(error);
  } else {
    throw new Error('Cannot parse given Error object');
  }
}

// Separate line and column numbers from a string of the form: (URI:Line:Column)
function extractLocation(locationString) {
  // Fail-fast but return locations like "(native)"
  if (locationString.indexOf(':') === -1) {
    return [locationString];
  }

  const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
  const parts = regExp.exec(locationString.replace(/[()]/g, ''));
  return [parts[1], parts[2] || undefined, parts[3] || undefined];
}

function parseV8OrIE(error) {
  const filtered = error.stack.split('\n').filter(line => {
    return !!line.match(CHROME_IE_STACK_REGEXP);
  });

  return filtered.map(line => {
    if (line.indexOf('(eval ') > -1) {
      // Throw away eval information until we implement stacktrace.js/stackframe#8
      line = line.replace(/eval code/g, 'eval').replace(/(\(eval at [^()]*)|(\),.*$)/g, '');
    }
    const tokens = line
      .replace(/^\s+/, '')
      .replace(/\(eval code/g, '(')
      .split(/\s+/)
      .slice(1);
    const locationParts = extractLocation(tokens.pop());
    const functionName = tokens.join(' ') || undefined;
    let fileName = locationParts[0];
    if (['eval', '<anonymous>'].includes(locationParts[0])) {
      fileName = undefined;
    }

    return normalizeOutput({
      functionName,
      fileName,
      lineNumber: locationParts[1],
      columnNumber: locationParts[2],
      source: line,
    });
  });
}

function parseOpera(error) {
  if (
    !error.stacktrace ||
    (error.message.indexOf('\n') > -1 && error.message.split('\n').length > error.stacktrace.split('\n').length)
  ) {
    return parseOpera9(error);
  } else if (!error.stack) {
    return parseOpera10(error);
  }
  return parseOpera11(error);
}

function parseOpera9(error) {
  const lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
  const lines = error.message.split('\n');
  const result = [];

  for (let i = 2; i < lines.length; i += 2) {
    const match = lineRE.exec(lines[i]);
    if (match) {
      result.push(
        normalizeOutput({
          fileName: match[2],
          lineNumber: match[1],
          source: lines[i],
        })
      );
    }
  }
  return result;
}
function parseOpera10(error) {
  const lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
  const lines = error.stacktrace.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i += 2) {
    const match = lineRE.exec(lines[i]);
    if (match) {
      result.push(
        normalizeOutput({
          functionName: match[3] || undefined,
          fileName: match[2],
          lineNumber: match[1],
          source: lines[i],
        })
      );
    }
  }

  return result;
}
// Opera 10.65+ Error.stack very similar to FF/Safari
function parseOpera11(error) {
  const filtered = error.stack.split('\n').filter(line => {
    return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
  });

  return filtered.map(line => {
    const tokens = line.split('@');
    const locationParts = extractLocation(tokens.pop());
    const functionCall = tokens.shift() || '';
    const functionName =
      functionCall.replace(/<anonymous function(: (\w+))?>/, '$2').replace(/\([^)]*\)/g, '') || undefined;
    let argsRaw;
    if (functionCall.match(/\(([^)]*)\)/)) {
      argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, '$1');
    }
    let args;
    if (argsRaw !== undefined && argsRaw !== '[arguments not available]') {
      args = argsRaw.split(',');
    }

    return normalizeOutput({
      functionName,
      args: args,
      fileName: locationParts[0],
      lineNumber: locationParts[1],
      columnNumber: locationParts[2],
      source: line,
    });
  });
}

function parseFFOrSafari(error) {
  const filtered = error.stack.split('\n').filter(line => {
    return !line.match(SAFARI_NATIVE_CODE_REGEXP);
  });

  return filtered.map(line => {
    // Throw away eval information until we implement stacktrace.js/stackframe#8
    if (line.indexOf(' > eval') > -1) {
      line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ':$1');
    }

    if (line.indexOf('@') === -1 && line.indexOf(':') === -1) {
      // Safari eval frames only have function names and nothing else
      return normalizeOutput({
        functionName: line,
      });
    } else {
      const functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
      const matches = line.match(functionNameRegex);
      let functionName;
      if (matches && matches[1]) {
        functionName = matches[1];
      }
      const locationParts = extractLocation(line.replace(functionNameRegex, ''));

      return normalizeOutput({
        functionName,
        fileName: locationParts[0],
        lineNumber: locationParts[1],
        columnNumber: locationParts[2],
        source: line,
      });
    }
  });
}
