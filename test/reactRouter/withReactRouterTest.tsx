import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';
import {HashRouter} from 'react-router-dom';

import {ControlledBase, emptyPage, ItemModel} from '../../src';
import ControlledPropsType from '../../src/controlled/ControlledPropsType';
import withReactRouter, {PropsType as WithReactRouterProps} from '../../src/reactRouter/withReactRouter';

type PageTableProps<T> = WithReactRouterProps<T, ControlledPropsType<T>>;

describe('reactRouter', () => describe('withReactRouter', () => {
  const NOOP = () => { /* NOOP */ };

  const PageTable = withReactRouter(ControlledBase) as
    (<T>(props: PageTableProps<T>) => JSX.Element);

  interface TestItem {id: string}
  const testItemModel = {
    idF: ({id}: TestItem) => id,
    fields: [{key: 'id', title: 'Id', sortable: true}]
  } as ItemModel<TestItem>;

  it('result can be used as JSX element', () => {
    renderIntoDocument(<HashRouter>
      <PageTable
        itemModel={testItemModel}
        page={emptyPage<TestItem>()} />
    </HashRouter>);
    renderIntoDocument(<HashRouter>
      <PageTable
        itemModel={testItemModel}
        onFetchArgsChange={NOOP}
        page={emptyPage<TestItem>()} />
    </HashRouter>);
  });

  it('supports default page/size/sort parameters', () => {
    renderIntoDocument(<HashRouter>
      <PageTable
        defaultPage={2}
        defaultSize={5}
        defaultSort={'id,DESC'}
        itemModel={testItemModel}
        page={emptyPage<TestItem>()} />
    </HashRouter>);
    renderIntoDocument(<HashRouter>
      <PageTable
        defaultPage={2}
        defaultSize={5}
        defaultSort={['id,DESC', 'id,ASC']}
        itemModel={testItemModel}
        page={emptyPage<TestItem>()} />
    </HashRouter>);
  });
}));
