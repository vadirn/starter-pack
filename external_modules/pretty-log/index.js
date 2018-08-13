/* global USE_LOG */
import parseError from './parseError';

export default function log(_message, _label) {
  const timestamp = new Date().getTime().toString(10);
  const readableTimestamp = `${timestamp.slice(0, 6)}_${timestamp.slice(6, 9)}_${timestamp.slice(9)}`;
  let logString = readableTimestamp;
  if (_label) {
    logString = `${logString}, ${_label}`;
  }
  const tracer = new Error();
  const location = parseError(tracer)[1];
  if (location) {
    logString = `${logString} at ${location.functionName} (${location.fileName}:${location.lineNumber}:${
      location.columnNumber
    })`;
  }
  // Check if _message looks like error
  if (_message && _message.message && (_message.stack || _message.stacktrace)) {
    const stack = parseError(_message)
      .map(
        stackLine =>
          `- at ${stackLine.functionName} (${stackLine.fileName}:${stackLine.lineNumber}:${stackLine.columnNumber})`
      )
      .join('\n');
    logString = `${logString}\n\n${_message.message}\n\n${stack}\n\n`;
  } else if (typeof _message === 'string') {
    logString = `${logString}\n\n${_message}\n\n`;
  } else {
    try {
      logString = `${logString}\n\n${JSON.stringify(_message, null, 2)}\n\n`;
    } catch (err) {
      logString = `${logString}\n\n${_message}\n\n(Note: stringify failed)\n\n`;
    }
  }
  if (console && console.log && USE_LOG) {
    console.log(logString);
  }
  return {
    timestamp,
    label: _label,
    message: logString,
  };
}
