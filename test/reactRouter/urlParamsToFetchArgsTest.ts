import {assert} from 'chai';
import {ItemModel} from '../../src';
import urlParamsToFetchArgs from '../../src/reactRouter/urlParamsToFetchArgs';

type TestItem = {id: string};

const itemModel: ItemModel<TestItem> = {
  idF: ({id}: TestItem) => id,
  fields: [],
};

describe('reactRouter/urlParamsToFetchArgs', () => {

  it('Missing page argument does not fill FetchArgs::page', () => {
    assert.equal(undefined, urlParamsToFetchArgs(itemModel, '', new URLSearchParams('')).page);
  });

  it('Page argument filled into FetchArgs::page', () => {
    assert.equal(41, urlParamsToFetchArgs(itemModel, '', new URLSearchParams('page=42')).page);
    assert.equal(41, urlParamsToFetchArgs(itemModel, '', new URLSearchParams('foo=bar&page=42')).page);
    assert.equal(41, urlParamsToFetchArgs(itemModel, 'myPrefix', new URLSearchParams('myPrefixpage=42')).page);
    assert.equal(41, urlParamsToFetchArgs(itemModel, 'myPrefix', new URLSearchParams('page=666&myPrefixpage=42')).page);
  });

});
