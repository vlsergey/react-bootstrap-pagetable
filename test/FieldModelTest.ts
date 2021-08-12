import {assert} from 'chai';

import {FieldModel} from '../src/';

describe('FieldModel', () => {
  it('Can assign FieldModel<T, string> to FieldModel<T, unknown>', () => {

    interface TestType {
      strField: string;
    }

    const stringField: FieldModel<TestType, string> = {
      key: 'strField',
      title: 'Test field'
    };
    const unknownField: FieldModel<TestType, unknown> = stringField;

    assert.equal(stringField, unknownField);
  });
});
