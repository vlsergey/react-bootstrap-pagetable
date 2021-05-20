import {FetchArgs, ItemModel} from '../../src';
import {assert} from 'chai';
import urlParamsToFetchArgs from '../../src/reactRouter/urlParamsToFetchArgs';

type TestItem = {id: string};

const itemModel: ItemModel<TestItem> = {
  idF: ({id}: TestItem) => id,
  fields: [],
};

const defaultFetchArgs : FetchArgs = {
  page: 555,
  size: 777,
}

describe('reactRouter/urlParamsToFetchArgs', () => {

  it('Missing page argument does not change FetchArgs::page', () => {
    assert.equal(555, urlParamsToFetchArgs(defaultFetchArgs, itemModel, '', new URLSearchParams('')).page);
  });

  it('Page argument filled into FetchArgs::page', () => {
    assert.equal(41, urlParamsToFetchArgs(defaultFetchArgs, itemModel, '', new URLSearchParams('page=42')).page);
    assert.equal(41, urlParamsToFetchArgs(defaultFetchArgs, itemModel, '', new URLSearchParams('foo=bar&page=42')).page);
    assert.equal(41, urlParamsToFetchArgs(defaultFetchArgs, itemModel, 'myPrefix', new URLSearchParams('myPrefixpage=42')).page);
    assert.equal(41, urlParamsToFetchArgs(defaultFetchArgs, itemModel, 'myPrefix', new URLSearchParams('page=666&myPrefixpage=42')).page);
  });

});
