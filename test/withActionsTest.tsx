import { ControlledBase, emptyPage, ItemModel, withActions,
  withSelectable } from '../src';
import React from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';

const NOOP = () => { /* NOOP */ };

describe( 'withActions', () => {
  it( 'result can be used as JSX element', () => {
    const PageTable = withActions( withSelectable( ControlledBase ) );

    type TestItem = { id : string };

    const testItemModel = {
      idF: ( { id } : TestItem ) => id,
      fields: [ { key: 'id', title: 'Id', sortable: true } ]
    } as ItemModel<TestItem>;

    renderIntoDocument( <PageTable
      fetchArgs={{}}
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      onFetchArgsChange={NOOP}
      onRefreshRequired={NOOP}
      page={emptyPage()} /> );
  } );
} );
