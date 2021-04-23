import { Action, FetchArgs, FieldModel, ItemModel, Page,
  UncontrolledPageTable as PageTable } from '../../lib/esm';
import React, { PureComponent, ReactNode } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import reactElementToJSXString from 'react-element-to-jsx-string';

interface StateType {
  addAction: boolean;
  emulateError: boolean;
  emulateLongLoading: boolean;
  selectable : boolean;
  smallSize : boolean;
}

function sleep( ms : number ) : Promise< unknown > {
  return new Promise( resolve => setTimeout( resolve, ms ) );
}

export default class UncontrolledDemo extends PureComponent<unknown, StateType> {

  state : StateType = {
    addAction: false,
    selectable: false,
    emulateError: false,
    emulateLongLoading: false,
    smallSize: false,
  }

  private handleCheckboxChange = ( { currentTarget: { checked, name } }: React.ChangeEvent<HTMLInputElement> ) => {
    this.setState( {
      [ name ]: !!checked,
    } as unknown as StateType );
  }

  render() : ReactNode {
    const { addAction, emulateError, emulateLongLoading, selectable, smallSize } = this.state;
    type TestType = { id : string };

    const itemModel : ItemModel<TestType> = {
      idF: ( { id }:TestType ) => id,
      fields: [
        {
          key: 'id',
          render: ( value: string ) => value,
          title: 'ID',
        } as FieldModel<string>,
      ],
    };

    const actions = addAction ? [
      {
        key: 'alert',
        title: 'Alert',
        enabled: ( items : TestType[] ) => items.length == 1,
        onAction: ( items : TestType[] ) => alert( items[ 0 ].id ),
      } as Action<TestType>,
    ] as Action<TestType>[] : [];

    const fetch = async( { page, size } : FetchArgs ) : Promise<Page<TestType>> => {
      if ( emulateLongLoading ) {
        await sleep( 1000 );
      }
      if ( emulateError ) {
        throw new Error( 'Unable to load page (emulated error)' );
      }
      return {
        content: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ].map( ( n : number ) => ( {
          id: String( n + page * 10 ),
        } ) ) as TestType[],
        empty: false,
        first: page === 0,
        hasContent: true,
        hasNext: page < 999,
        hasPrevious: page > 0,
        last: page === 999,
        number: page,
        numberOfElements: 10,
        size,
        totalElements: 10000,
        totalPages: 1000,
      };
    };

    const pageTable = <PageTable
      actions={actions}
      fetch={fetch}
      itemModel={itemModel}
      selectable={selectable}
      size={smallSize ? 'sm' : undefined} />;

    return <Container>
      <h2>Options</h2>
      <Form>
        <Form.Check checked={addAction} label="Include simple action ('alert the ID')" name="addAction" onChange={this.handleCheckboxChange} type="checkbox" />
        <Form.Check checked={emulateError} label="Emulate error on loading" name="emulateError" onChange={this.handleCheckboxChange} type="checkbox" />
        <Form.Check checked={emulateLongLoading} label="Emulate long loading (add 1 second pause to fetch function)" name="emulateLongLoading" onChange={this.handleCheckboxChange} type="checkbox" />
        <Form.Check checked={selectable} label="Set selectable flag" name="selectable" onChange={this.handleCheckboxChange} type="checkbox" />
        <Form.Check checked={smallSize} label="Set 'size=&quot;sm&quot'" name="smallSize" onChange={this.handleCheckboxChange} type="checkbox" />
      </Form>
      <h2>Result</h2>
      {pageTable}
      <h2>JSX</h2>
      <pre>{reactElementToJSXString( pageTable, {
        showDefaultProps: false,
        showFunctions: true,
        tabStop: 2,
      } )}</pre>
    </Container>;
  }

}
