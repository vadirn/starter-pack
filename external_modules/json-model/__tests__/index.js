import { merge } from 'object-state-storage';

import JsonModel from '../index.js';

describe('object-state-model', () => {
  test('skips default values for keys that already exist in state', () => {
    const model = new JsonModel({
      __type: 'object',
      __value: {
        a: {
          __type: 'string',
          __value: 'a',
        },
        b: {
          __type: 'string',
          __value: 'b',
        },
      },
    });
    expect(model.applyTo({}, { a: 'foobar' })).toEqual({ b: 'b' });
    expect(model.applyTo({ a: 'b' }, {})).toEqual({ a: 'b', b: 'b' });
  });
  test('array element assignment', () => {
    const model = new JsonModel({
      __type: 'object',
      __value: {
        array: {
          __type: 'array',
          __item: {
            __type: 'object',
            __value: {
              a: {
                __type: 'string',
                __value: 'default value',
              },
            },
          },
          __value: [],
        },
      },
    });
    expect(model.applyTo({}, {})).toEqual({ array: [] });
    expect(() => model.applyTo({ array: ['some value'] }, {})).toThrow();
    expect(model.applyTo({ array: [{}] }, {})).toEqual({ array: [{ a: 'default value' }] });
    expect(() => model.applyTo({ array: { 0: 'some value' } }, {})).toThrow();
    expect(model.applyTo({ array: { 0: {} } }, {})).toEqual({ array: { 0: { a: 'default value' } } });
    expect(model.applyTo({ array: { 0: {} } }, { array: [] })).toEqual({ array: { 0: { a: 'default value' } } });
    expect(merge({ array: [] }, model.applyTo({ array: { 0: {} } }, {}))).toEqual({ array: [{ a: 'default value' }] });
  });
  test('array of arrays', () => {
    const model = new JsonModel({
      __type: 'object',
      __value: {
        nestedArray: {
          __type: 'array',
          __item: {
            __type: 'array',
            __item: {
              __type: 'object',
              __value: {
                foo: {
                  __type: 'string',
                  __value: 'bar',
                },
              },
            },
          },
        },
      },
    });
    expect(model.applyTo({ nestedArray: { 0: { 0: {} } } }, {})).toEqual({
      nestedArray: { 0: { 0: { foo: 'bar' } } },
    });
    expect(
      merge({ nestedArray: [[]] }, model.applyTo({ nestedArray: { 0: { 0: {} } } }, { nestedArray: [[]] }))
    ).toEqual({
      nestedArray: [[{ foo: 'bar' }]],
    });
  });
  test('readme example', () => {
    const model = new JsonModel({
      __type: 'object',
      __value: {
        stringKey: {
          __type: 'string',
          __value: 'default string value',
          __nullable: true,
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
              __type: '*',
            },
          },
        },
      },
    });

    expect(() => {
      model.applyTo({ stringKey: true });
    }).toThrow();

    expect(model.applyTo({ objectKey: { anyKey: 'any value' } })).toEqual({
      stringKey: 'default string value',
      objectKey: { anyKey: 'any value' },
    });

    expect(model.applyTo({ objectKey: { anyKey: 'any value' } }, { stringKey: 'some existing value' })).toEqual({
      objectKey: { anyKey: 'any value' },
    });
  });
  test('assigning to a state with default value', () => {
    const model = new JsonModel({
      __type: 'object',
      __value: { '*': { __type: '*' }, number: { __type: 'number', __value: 0 } },
    });
    expect(Object.keys(model.applyTo({}, { number: 0 }))).toEqual([]);
    expect(model.applyTo({ foo: 'bar' }, {})).toEqual({ foo: 'bar', number: 0 });
  });
});
