import { ControlledBase, emptyPage, ItemModel, withFetchArgsInState } from '../src';
import React from 'react';
import { renderIntoDocument } from 'react-dom/test-utils';

const NOOP = () => { /* NOOP */ };

describe( 'withFetchArgsInState', () => {
  it( 'result can be used as JSX element', () => {
    const PageTable = withFetchArgsInState( ControlledBase );

    type TestItem = { id : string };

    const testItemModel = {
      idF: ( { id } : TestItem ) => id,
      fields: [ { key: 'id', title: 'Id', sortable: true } ]
    } as ItemModel<TestItem>;

    renderIntoDocument( <PageTable
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      page={emptyPage()} /> );

    renderIntoDocument( <PageTable
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      onFetchArgsChange={NOOP}
      page={emptyPage()} /> );
  } );
} );
