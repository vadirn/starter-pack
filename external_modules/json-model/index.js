import get from 'lodash.get';
import { getJsonType } from 'object-state-storage';

function assign(accum, key, value) {
  if (value !== undefined) {
    accum[key] = value;
  }
}

export function applyDescription(value, description, pathToValue = [], shouldApplyDefaultValues = () => true) {
  // description: { __type, __value, __nullable, __item }
  let providedType = 'undefined';
  if (value !== undefined) {
    providedType = getJsonType(value);
  }
  const describedValue = description.__value;
  const describedType = description.__type;
  const describedNullability = description.__nullable;
  const describedItem = description.__item;

  if (providedType === 'undefined') {
    if (shouldApplyDefaultValues(pathToValue)) {
      if (describedType === 'object') {
        return applyDescription({}, description, pathToValue, shouldApplyDefaultValues);
      } else {
        return describedValue;
      }
    }
  } else if (providedType === describedType) {
    if (describedType === 'object') {
      const accum = {};
      // modifierKeys
      const modifierKeys = new Set(Object.keys(value));
      // run through definitionValue keys
      for (const definitionKey of Object.keys(describedValue)) {
        if (definitionKey !== '*') {
          assign(
            accum,
            definitionKey,
            applyDescription(
              value[definitionKey],
              describedValue[definitionKey],
              [...pathToValue, definitionKey],
              shouldApplyDefaultValues
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
            applyDescription(
              value[modifierKey],
              describedValue['*'],
              [...pathToValue, modifierKey],
              shouldApplyDefaultValues
            )
          );
          modifierKeys.delete(modifierKey);
        }
      }
      if (modifierKeys.size > 0) {
        throw new Error(`No definition for "${pathToValue.join('.')}[${modifierKeys.join(', ')}]"`);
      }
      return accum;
    } else if (describedType === 'array') {
      // run through modifier items if definitionItem exists
      if (describedItem !== undefined) {
        const accum = [];
        for (const [idx, modifierItem] of value.entries()) {
          accum.push(applyDescription(modifierItem, describedItem, [...pathToValue, idx], shouldApplyDefaultValues));
        }
        return accum;
      }
      return value;
    }
    // just return modifier
    return value;
  } else {
    // types do not match
    // check if modifier allows this
    // otherwise throw an error
    if ((providedType === 'null' && describedNullability === true) || describedType === '*') {
      return value;
    } else if (providedType === 'object' && describedType === 'array' && describedItem !== undefined) {
      const childKeys = new Set(Object.keys(value));
      const accum = {};
      for (const childKey of childKeys) {
        assign(
          accum,
          childKey,
          applyDescription(value[childKey], describedItem, [...pathToValue, childKey], shouldApplyDefaultValues)
        );
      }
      return accum;
    }
    throw new Error(`Types do not match at "${pathToValue.join('.')}" (${providedType} - ${describedType})`);
  }
}

export default class JsonModel {
  constructor(description) {
    this._description = description;
  }
  applyTo(value, existingValue) {
    if (existingValue !== undefined) {
      const shouldApplyDefaultValues = function shouldApplyDefaultValues(pathToValue) {
        return !(existingValue && get(existingValue, pathToValue) !== undefined);
      };
      return applyDescription(value, this._description, [], shouldApplyDefaultValues);
    }
    return applyDescription(value, this._description);
  }
}

export function compose(...models) {
  // test if all of provided models are of type "object"
  for (const model of models) {
    if (model._description.__type !== 'object') {
      throw new Error('Only models of "object" type are composable');
    }
  }
  const allKeys = [];
  for (const model of models) {
    for (const key of Object.keys(model._description.__value)) {
      if (allKeys.includes(key)) {
        throw new Error('No duplicate keys are allowed when composing models');
      }
      allKeys.push(key);
    }
  }
  const __value = models.reduce((accum, model) => {
    Object.assign(accum, model._description.__value);
    return accum;
  }, {});
  return new JsonModel({
    __type: 'object',
    __value,
  });
}
