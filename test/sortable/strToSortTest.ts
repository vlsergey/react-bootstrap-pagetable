import {assert} from 'chai';
import strToSort from '../../src/sortable/strToSort';

describe('sortable', () => describe('strToSort', () => {

  it('Correctly parses string', () => {
    assert.equal(strToSort(undefined), null);
    assert.equal(strToSort(null), null);
    assert.equal(strToSort(''), null);
    assert.deepEqual(strToSort('name'), [ {field: 'name', direction: 'ASC'} ]);
    assert.deepEqual(strToSort('name,DESC'), [ {field: 'name', direction: 'DESC'} ]);
    assert.deepEqual(strToSort('name,AnyThinkg'), [ {field: 'name', direction: 'ASC'} ]);
  });

}));
