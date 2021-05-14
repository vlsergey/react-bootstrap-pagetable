import {assert} from 'chai';
import fetchArgsToUrlParams from '../../src/reactRouter/fetchArgsToUrlParams';
import {ItemModel} from '../../src';

type TestItem = {id: string};

const itemModel: ItemModel<TestItem> = {
  idF: ({id}: TestItem) => id,
  fields: [],
};

describe('reactRouter/fetchArgsToUrlParams', () => {

  it('Do not generate page argument if first page ', () => {
    assert.equal('', fetchArgsToUrlParams(itemModel, null, '', {page: 0}).toString());
  });

  it('Do not clears page argument if changed to first page ', () => {
    assert.equal('', fetchArgsToUrlParams(itemModel, null, 'page=42', {page: 0}).toString());
  });

  it('Correctly serialized second page as page=1', () => {
    assert.equal('page=1', fetchArgsToUrlParams(itemModel, null, '', {page: 1}).toString());
    assert.equal('myPrefixpage=1', fetchArgsToUrlParams(itemModel, 'myPrefix', '', {page: 1}).toString());
    assert.equal('page=1', fetchArgsToUrlParams(itemModel, null, 'page=42', {page: 1}).toString());
    assert.equal('foo=bar&page=1', fetchArgsToUrlParams(itemModel, null, 'foo=bar', {page: 1}).toString());
    assert.equal('page=42&myPrefixpage=1', fetchArgsToUrlParams(itemModel, 'myPrefix', 'page=42', {page: 1}).toString());
  });

});
