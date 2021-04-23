import PageTable, { Action, FieldModel, ItemModel, singlePage } from '../../lib/esm';
import React, { PureComponent, ReactNode } from 'react';

export default class Application extends PureComponent<unknown> {

  render() : ReactNode {
    type TestType = { id : string };

    const itemModel : ItemModel<TestType> = {
      fields: [
        {
          key: 'id',
          render: ( v:string ) => v,
          title: 'ID'
        } as FieldModel<string>,
      ],
      idF: ( { id } : TestType ) => id,
    };

    const fetch = () => Promise.resolve( singlePage( [
      { id: 'A' },
      { id: 'B' },
      { id: 'C' }
    ] ) );

    const actions : Action[] = [ {
      key: 'alert',
      onAction: ( items: TestType[] ) => alert( items[ 0 ].id ),
      enabled: ( items: TestType[] ) => items.length == 1,
      title: 'Alert'
    } ];

    return <>
      <h1>Simple table with static content</h1>
      <PageTable actions={actions} fetch={fetch} itemModel={itemModel} />
    </>;
  }

}
