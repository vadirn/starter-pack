import get from 'lodash/get';

// get json type of an object
// string, number, object, array, boolean, null
export function getJsonType(obj) {
  if (Array.isArray(obj)) {
    return 'array';
  } else if (obj === null) {
    return 'null';
  } else {
    const type = (typeof obj).toLowerCase();
    if (['string', 'number', 'object', 'boolean'].indexOf(type) < 0) {
      throw new Error(`${type} is not a JSON-compatible type`);
    }
    return type;
  }
}

function assign(accum, key, value) {
  if (value !== undefined) {
    accum[key] = value;
  }
}

export function applyDescription(patch, description, path = [], shouldApplyDefaults = () => true) {
  // description: { __type, __value, __nullable, __item }
  let providedType = 'undefined';
  if (patch !== undefined) {
    providedType = getJsonType(patch);
  }
  const describedValue = description.__value;
  const describedType = description.__type;
  const describedNullability = description.__nullable;
  const describedItem = description.__item;

  if (providedType === 'undefined') {
    if (shouldApplyDefaults(path)) {
      if (describedType === 'object') {
        return applyDescription({}, description, path, shouldApplyDefaults);
      } else {
        return describedValue;
      }
    }
  } else if (providedType === describedType) {
    if (describedType === 'object') {
      const accum = {};
      // modifierKeys
      const modifierKeys = new Set(Object.keys(patch));
      // run through definitionValue keys
      for (const definitionKey of Object.keys(describedValue)) {
        if (definitionKey !== '*') {
          assign(
            accum,
            definitionKey,
            applyDescription(
              patch[definitionKey],
              describedValue[definitionKey],
              [...path, definitionKey],
              shouldApplyDefaults
            )
          );
          modifierKeys.delete(definitionKey);
        }
      }
      if (describedValue['*'] !== undefined) {
        const modifierKeysCopy = new Set(modifierKeys);
        for (const modifierKey of modifierKeysCopy) {
          assign(
            accum,
            modifierKey,
            applyDescription(patch[modifierKey], describedValue['*'], [...path, modifierKey], shouldApplyDefaults)
          );
          modifierKeys.delete(modifierKey);
        }
      }
      if (modifierKeys.size > 0) {
        throw new Error(`No definition for "${path.join('.')}[${Array.from(modifierKeys).join(', ')}]"`);
      }
      return accum;
    } else if (describedType === 'array') {
      // run through modifier items if definitionItem exists
      if (describedItem !== undefined) {
        const accum = [];
        for (const [idx, modifierItem] of patch.entries()) {
          accum.push(applyDescription(modifierItem, describedItem, [...path, idx], shouldApplyDefaults));
        }
        return accum;
      }
      return patch;
    }
    // just return modifier
    return patch;
  } else {
    // types do not match
    // check if modifier allows this
    // otherwise throw an error
    if ((providedType === 'null' && describedNullability === true) || describedType === '*') {
      return patch;
    } else if (providedType === 'object' && describedType === 'array' && describedItem !== undefined) {
      const childKeys = new Set(Object.keys(patch));
      const accum = {};
      for (const childKey of childKeys) {
        assign(
          accum,
          childKey,
          applyDescription(patch[childKey], describedItem, [...path, childKey], shouldApplyDefaults)
        );
      }
      return accum;
    }
    throw new Error(`Types do not match at "${path.join('.')}" (${providedType} - ${describedType})`);
  }
}

export class JsonModel {
  constructor(description) {
    this._description = description;
  }
  apply(patch, source) {
    if (source !== undefined) {
      // source is only required to check if it is necessary to use default value for patch at path or not
      const shouldApplyDefaultValues = function shouldApplyDefaultValues(path) {
        return !(source && get(source, path) !== undefined);
      };
      return applyDescription(patch, this._description, [], shouldApplyDefaultValues);
    }
    return applyDescription(patch, this._description);
  }
}
