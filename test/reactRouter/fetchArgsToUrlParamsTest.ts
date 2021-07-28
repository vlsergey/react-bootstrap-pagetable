import {assert} from 'chai';

import {ItemModel} from '../../src';
import fetchArgsToUrlParams from '../../src/reactRouter/fetchArgsToUrlParams';

describe('reactRouter', () => describe('fetchArgsToUrlParams', () => {

  interface TestItem {id: string}

  const itemModel: ItemModel<TestItem> = {
    idF: ({id}: TestItem) => id,
    fields: [],
  };

  it('Correctly serialized second page as page=1', () => {
    assert.equal('page=2&size=10', fetchArgsToUrlParams(itemModel, null, '', {page: 1, size: 10}).toString());
    assert.equal('myPrefixpage=2&myPrefixsize=10', fetchArgsToUrlParams(itemModel, 'myPrefix', '', {page: 1, size: 10}).toString());
    assert.equal('page=2&size=10', fetchArgsToUrlParams(itemModel, null, 'page=42', {page: 1, size: 10}).toString());
    assert.equal('foo=bar&page=2&size=10', fetchArgsToUrlParams(itemModel, null, 'foo=bar', {page: 1, size: 10}).toString());
    assert.equal('page=42&myPrefixpage=2&myPrefixsize=10', fetchArgsToUrlParams(itemModel, 'myPrefix', 'page=42', {page: 1, size: 10}).toString());
  });

}));
