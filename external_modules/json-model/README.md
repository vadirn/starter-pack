# json-model

Describe json structure. Check and extend provided objects against it.

For example:

```javascript
import JsonModel from 'objec-state-model';

const model = new JsonModel({
  __type: 'object',
  __value: {
    stringKey: {
      __type: 'string',
      __value: 'default string value', // optional, default value
      __nullable: true, // optional, if the key can be null or not
    },
    boolKey: {
      __type: 'boolean',
    },
    numberKey: {
      __type: 'number',
    },
    nullKey: {
      __type: 'null',
    },
    arrayKey: {
      __type: 'array',
      __item: {
        // optional, array item description
        __type: '*',
      },
    },
    objectKey: {
      __type: 'object',
      __value: {
        '*': {
          // any key
          __type: '*', // any value
        },
      },
    },
  },
});

model.applyTo({ stringKey: true }); // will throw an error, because types do not match
model.applyTo({ objectKey: { anyKey: 'any value' } }); // will return { stringKey: 'default string value', objectKey: { anyKey: 'any value' } }

// applyTo also accepts existingValue as a second argument
// default value is not going to be set, if it exists in existingValue
model.applyTo({ objectKey: { anyKey: 'any value' } }, { stringKey: 'some existing string' }); // will return { objectKey: { anyKey: 'any value' } }
```
