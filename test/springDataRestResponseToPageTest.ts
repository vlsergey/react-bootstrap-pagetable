import {assert} from 'chai';

import springDataRestResponseToPage from '../src/springDataRestResponseToPage';

describe('springDataRestResponseToPage', () => {
  it('can be compiled with correct collection key', () => {
    springDataRestResponseToPage('items', {
      _embedded: {
        items: [{}, {}, {}]
      },
      page: {
        size: 0,
        totalElements: 0,
        totalPages: 0,
        number: 0,
      }
    });
  });

  it('it won\'t be compiled with incorrect collection key', () => {
    assert.throws(() => springDataRestResponseToPage('items', {
      _embedded: {
        // Main line of test case is next one
        // @ts-expect-error TS2322
        NO_ITEMS: [{}, {}, {}]
      },
      page: {
        size: 0,
        totalElements: 0,
        totalPages: 0,
        number: 0,
      }
    }), Error, /^Missing property 'items' in response '_embedded' object property$/);
  });
});
