import {ControlledBase, emptyPage, ItemModel, withReactRouter} from '../src';
import {HashRouter} from 'react-router-dom';
import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

const NOOP = () => { /* NOOP */ };

describe('withReactRouter', () => {
  it('result can be used as JSX element', () => {
    const PageTable = withReactRouter(ControlledBase);

    type TestItem = {id: string};

    const testItemModel = {
      idF: ({id}: TestItem) => id,
      fields: [ {key: 'id', title: 'Id', sortable: true} ]
    } as ItemModel<TestItem>;

    renderIntoDocument(<HashRouter>
      <PageTable
        itemModel={testItemModel}
        page={emptyPage()} />
    </HashRouter>);

    renderIntoDocument(<HashRouter>
      <PageTable
        itemModel={testItemModel}
        onFetchArgsChange={NOOP}
        page={emptyPage()} />
    </HashRouter>);
  });
});
