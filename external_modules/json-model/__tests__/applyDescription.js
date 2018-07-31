import { applyDescription } from '../index.js';

describe('applyDescription()', () => {
  describe('types', () => {
    test('valid "string" modifier', () => {
      expect(applyDescription('foobar', { __type: 'string' })).toEqual('foobar');
      expect(applyDescription('foobar', { __type: '*' })).toEqual('foobar');
    });
    test('valid "number" modifier', () => {
      expect(applyDescription(1, { __type: 'number' })).toEqual(1);
      expect(applyDescription(1, { __type: '*' })).toEqual(1);
    });
    test('valid "null" modifier', () => {
      expect(applyDescription(null, { __type: 'null' })).toEqual(null);
      expect(applyDescription(null, { __type: 'string', __nullable: true })).toEqual(null);
      expect(applyDescription(null, { __type: '*' })).toEqual(null);
    });
    test('valid "array" modifier', () => {
      expect(applyDescription([], { __type: 'array' })).toEqual([]);
      expect(applyDescription([], { __type: '*' })).toEqual([]);
    });
    test('valid "boolean" modifier', () => {
      expect(applyDescription(true, { __type: 'boolean' })).toEqual(true);
      expect(applyDescription(true, { __type: '*' })).toEqual(true);
    });
    test('valid "object" modifier', () => {
      expect(applyDescription({ foo: 'bar' }, { __type: 'object', __value: { foo: { __type: 'string' } } })).toEqual({
        foo: 'bar',
      });
      expect(applyDescription({ foo: 'bar' }, { __type: '*' })).toEqual({ foo: 'bar' });
      expect(
        applyDescription(
          { a: { b: 'c' } },
          { __type: 'object', __value: { a: { __type: 'object', __value: { b: { __type: 'string' } } } } }
        )
      ).toEqual({ a: { b: 'c' } });
      expect(() => {
        applyDescription({ a: 'b' }, { __type: 'object', __value: { c: { __type: 'string' } } });
      }).toThrow();
      expect(applyDescription({ a: 'b' }, { __type: 'object', __value: { '*': { __type: 'string' } } })).toEqual({
        a: 'b',
      });
      expect(
        applyDescription(
          { a: 'b', c: 1 },
          { __type: 'object', __value: { '*': { __type: 'string' }, c: { __type: 'number' } } }
        )
      ).toEqual({ a: 'b', c: 1 });
    });
  });
  test('returns default value for "undefined" modifier', () => {
    expect(applyDescription(undefined, { __value: 'anything' })).toEqual('anything');
    expect(applyDescription({}, { __type: 'object', __value: { foo: { __type: 'string', __value: 'bar' } } })).toEqual({
      foo: 'bar',
    });
    expect(
      applyDescription(undefined, { __type: 'object', __value: { foo: { __type: 'string', __value: 'bar' } } })
    ).toEqual({
      foo: 'bar',
    });
  });
  test('modifying array item', () => {
    expect(applyDescription({ 1: 'foobar' }, { __type: 'array', __item: { __type: 'string' } })).toEqual({
      1: 'foobar',
    });
    expect(
      applyDescription(
        { a: { 1: { b: 'c' } } },
        {
          __type: 'object',
          __value: { a: { __type: 'array', __item: { __type: 'object', __value: { b: { __type: 'string' } } } } },
        }
      )
    ).toEqual({ a: { 1: { b: 'c' } } });
    // extend with default values
    expect(
      applyDescription(
        { 1: { foo: 'bar' } },
        {
          __type: 'array',
          __item: {
            __type: 'object',
            __value: { foo: { __type: 'string' }, extension: { __type: 'string', __value: 'default extension' } },
          },
        }
      )
    ).toEqual({ 1: { foo: 'bar', extension: 'default extension' } });
  });
  test('checks array items defintion', () => {
    expect(() => applyDescription([{}], { __type: 'array', __item: { __type: 'string' } })).toThrow();
  });
});
