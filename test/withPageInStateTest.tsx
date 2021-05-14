import {ControlledBase, emptyPage, ItemModel, withActions,
  withPageInState, withSelectable} from '../src';
import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

const NOOP = () => { /* NOOP */ };

describe('withPageInState', () => {
  it('result can be used as JSX element', () => {
    const PageTable = withPageInState(withActions(withSelectable(ControlledBase)));

    type TestItem = {id: string};

    const testItemModel = {
      idF: ({id}: TestItem) => id,
      fields: [ {key: 'id', title: 'Id', sortable: true} ]
    } as ItemModel<TestItem>;

    renderIntoDocument(<PageTable
      fetch={() => Promise.resolve(emptyPage())}
      fetchArgs={{}}
      itemModel={testItemModel}
      onFetchArgsChange={NOOP} />);
  });
});
