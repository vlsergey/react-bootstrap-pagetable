import { emptyPage, ItemModel, UncontrolledPageTable } from '../src';
import React from 'react';

describe( 'index', () => {
  describe( 'UncontrolledPageTable', () => {
    it( 'can be used as JSX element', () => {

      type TestItem = { id : string };

      const testItemModel = {
        idF: ( { id } : TestItem ) => id,
        fields: [ { key: 'id', title: 'Id', sortable: true } ]
      } as ItemModel<TestItem>;

      <UncontrolledPageTable
        fetch={() => Promise.resolve( emptyPage<TestItem>() )}
        itemModel={testItemModel} />;
    } );
  } );
} );
