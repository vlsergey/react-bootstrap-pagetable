import {FetchArgs, ItemModel} from '../../src';
import {assert} from 'chai';
import urlParamsToFetchArgs from '../../src/reactRouter/urlParamsToFetchArgs';

describe('reactRouter', () => describe('urlParamsToFetchArgs', () => {

  type TestItem = {id: string};

  const itemModel: ItemModel<TestItem> = {
    idF: ({id}: TestItem) => id,
    fields: [],
  };

  const defaultFetchArgs: FetchArgs = {
    page: 555,
    size: 777,
  };

  it('Missing page argument does not change FetchArgs::page', () => {
    assert.equal(555, urlParamsToFetchArgs(defaultFetchArgs, itemModel, '', new URLSearchParams('')).page);
  });

  it('Page argument filled into FetchArgs::page', () => {
    assert.equal(41, urlParamsToFetchArgs(defaultFetchArgs, itemModel, '', new URLSearchParams('page=42')).page);
    assert.equal(41, urlParamsToFetchArgs(defaultFetchArgs, itemModel, '', new URLSearchParams('foo=bar&page=42')).page);
    assert.equal(41, urlParamsToFetchArgs(defaultFetchArgs, itemModel, 'myPrefix', new URLSearchParams('myPrefixpage=42')).page);
    assert.equal(41, urlParamsToFetchArgs(defaultFetchArgs, itemModel, 'myPrefix', new URLSearchParams('page=666&myPrefixpage=42')).page);
  });

  it('Correctly initializes sort field', () => {
    const defaultFetchArgs = {
      page: 1,
      size: 2,
      sort: [ {field: 'name', direction: 'ASC'} ],
    } as FetchArgs;

    const actual = urlParamsToFetchArgs(defaultFetchArgs, itemModel,
      undefined, new URLSearchParams(''));

    assert.equal(1, actual.page);
    assert.equal(2, actual.size);
    assert.deepEqual([ {field: 'name', direction: 'ASC'} ], actual.sort);
  });

  it('Correctly updates sort field', () => {
    const defaultFetchArgs = {
      page: 1,
      size: 2,
      sort: [ {field: 'name', direction: 'ASC'} ],
    } as FetchArgs;

    const actual = urlParamsToFetchArgs(defaultFetchArgs, itemModel,
      undefined, new URLSearchParams('page=3&size=4&sort=name%2CDESC'));

    assert.equal(2, actual.page);
    assert.equal(4, actual.size);
    assert.deepEqual([ {field: 'name', direction: 'DESC'} ], actual.sort);
  });

}));
