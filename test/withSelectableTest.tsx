import {ControlledBase, emptyPage, ItemModel, withSelectable} from '../src';
import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

const NOOP = () => { /* NOOP */ };

describe('withSelectable', () => {
  it('result can be used as JSX element', () => {
    const PageTable = withSelectable(ControlledBase);

    type TestItem = {id: string};

    const testItemModel = {
      idF: ({id}: TestItem) => id,
      fields: [ {key: 'id', title: 'Id', sortable: true} ]
    } as ItemModel<TestItem>;

    renderIntoDocument(<PageTable
      fetchArgs={{page: 0, size: 10}}
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      onFetchArgsChange={NOOP}
      onSelectedIdsChange={NOOP}
      page={emptyPage()}
      selectable
      selectedIds={[]} />);
  });
});
