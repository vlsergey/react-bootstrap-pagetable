import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

import {ControlledBase, emptyPage, ItemModel, withActions,
  withPageInState, withSelectable} from '../src';

const NOOP = () => { /* NOOP */ };

describe('withPageInState', () => {
  it('result can be used as JSX element', () => {
    const PageTable = withPageInState(withActions(withSelectable(ControlledBase)));

    interface TestItem {id: string}

    const testItemModel = {
      idF: ({id}: TestItem) => id,
      fields: [{key: 'id', title: 'Id', sortable: true}]
    } as ItemModel<TestItem>;

    renderIntoDocument(<PageTable
      fetch={() => Promise.resolve(emptyPage())}
      fetchArgs={{page: 0, size: 10}}
      itemModel={testItemModel}
      onFetchArgsChange={NOOP} />);
  });
});
