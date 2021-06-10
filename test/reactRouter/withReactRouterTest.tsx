import {ControlledBase, emptyPage, ItemModel, withReactRouter} from '../../src';
import {HashRouter} from 'react-router-dom';
import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

describe('reactRouter', () => describe('withReactRouter', () => {
  const NOOP = () => { /* NOOP */ };

  const PageTable = withReactRouter(ControlledBase);
  type TestItem = {id: string};
  const testItemModel = {
    idF: ({id}: TestItem) => id,
    fields: [ {key: 'id', title: 'Id', sortable: true} ]
  } as ItemModel<TestItem>;

  it('result can be used as JSX element', () => {
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

  it('supports default page/size/sort parameters', () => {
    renderIntoDocument(<HashRouter>
      <PageTable
        defaultPage={2}
        defaultSize={5}
        defaultSort={'id,DESC'}
        itemModel={testItemModel}
        page={emptyPage()} />
    </HashRouter>);
    renderIntoDocument(<HashRouter>
      <PageTable
        defaultPage={2}
        defaultSize={5}
        defaultSort={[ 'id,DESC', 'id,ASC' ]}
        itemModel={testItemModel}
        page={emptyPage()} />
    </HashRouter>);
  });
}));
