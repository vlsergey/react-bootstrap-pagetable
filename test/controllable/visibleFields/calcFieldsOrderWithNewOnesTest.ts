import {assert} from 'chai';

import calcFieldsOrderWithNewOnes from '../../../src/controlled/visibleFields/calcFieldsOrderWithNewOnes';

describe('controlled', () => describe('visibleFields', () => describe('calcFieldsOrderWithNewOnes', () => {

  it('Correctly works with empty configs', () => {
    assert.deepEqual(['a', 'b', 'c'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'b', 'c'], [], []));
  });

  it('Correctly works with config equals to initial values', () => {
    assert.deepEqual(['a', 'b', 'c'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'b', 'c'], ['a', 'b', 'c'], []));
  });

  it('Correctly works with new first field', () => {
    assert.deepEqual(['a', 'b', 'c'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'b', 'c'], ['b', 'c'], []));
    assert.deepEqual(['a', 'c', 'b'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'c', 'b'], ['c', 'b'], []));
  });

  it('Correctly works with new non-first field', () => {
    assert.deepEqual(['a', 'b', 'c'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'b', 'c'], ['a', 'c'], []));
    assert.deepEqual(['c', 'a', 'b'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'b', 'c'], ['c', 'a'], []));
  });

  it('Correctly works with new last field', () => {
    assert.deepEqual(['a', 'b', 'c'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'b', 'c'], ['a', 'b'], []));
    assert.deepEqual(['b', 'c', 'a'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'b', 'c'], ['b', 'a'], []));
  });

  it('Correctly works with removed field', () => {
    assert.deepEqual(['b', 'c'], calcFieldsOrderWithNewOnes(['b', 'c'], ['b', 'c'], ['a', 'b', 'c'], []));
    assert.deepEqual(['a', 'c'], calcFieldsOrderWithNewOnes(['a', 'c'], ['a', 'c'], ['a', 'b', 'c'], []));
    assert.deepEqual(['a', 'b'], calcFieldsOrderWithNewOnes(['a', 'b'], ['a', 'b'], ['a', 'b', 'c'], []));
  });

  it('Can display field not from default set', () => {
    assert.deepEqual(['a', 'b', 'c'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['b', 'c'], ['a', 'b', 'c'], []));
    assert.deepEqual(['a', 'b', 'c'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'c'], ['a', 'b', 'c'], []));
    assert.deepEqual(['a', 'b', 'c'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'b'], ['a', 'b', 'c'], []));

    assert.deepEqual(['a'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['b', 'c'], ['a'], ['b', 'c']));
    assert.deepEqual(['b'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'c'], ['b'], ['a', 'c']));
    assert.deepEqual(['c'], calcFieldsOrderWithNewOnes(['a', 'b', 'c'], ['a', 'b'], ['c'], ['a', 'b']));
  });

})));
