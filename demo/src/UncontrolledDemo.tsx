import { Action, FetchArgs, fetchFromArray, FieldModel, ItemModel, Page,
  UncontrolledPageTable as PageTable } from '@vlsergey/react-bootstrap-pagetable';
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

type TestType = { id : string };

const sourceDataArray : TestType[] =
  ( [ ...( Array( 10000 ) as unknown[] ).keys() ] as number[] )
    .map( ( key : number ) => ( { id: String( key ) } ) );

export default class UncontrolledDemo extends PureComponent<unknown, StateType> {

  state : StateType = {
    addAction: false,
    selectable: false,
    emulateError: false,
    emulateLongLoading: false,
    smallSize: false,
  }

  private fetchData = async( fetchArgs : FetchArgs ) : Promise<Page<TestType>> => {
    const { emulateError, emulateLongLoading } = this.state;
    if ( emulateLongLoading ) {
      await sleep( 1000 );
    }
    if ( emulateError ) {
      throw new Error( 'Unable to load page (emulated error)' );
    }
    return fetchFromArray( sourceDataArray, fetchArgs );
  }

  private handleCheckboxChange = ( { currentTarget: { checked, name } }: React.ChangeEvent<HTMLInputElement> ) => {
    this.setState( {
      [ name ]: !!checked,
    } as unknown as StateType );
  }

  render() : ReactNode {
    const { addAction, emulateError, emulateLongLoading, selectable, smallSize } = this.state;

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

    const pageTable = <PageTable
      actions={actions}
      fetch={this.fetchData}
      itemModel={itemModel}
      selectable={selectable}
      size={smallSize ? 'sm' : undefined} />;

    const renderCheckbox = ( checked : boolean, key : string, label : ReactNode ) =>
      <Form.Check
        checked={checked}
        id={'unctrld_chk_' + key}
        label={label}
        name={key}
        onChange={this.handleCheckboxChange}
        type="checkbox" />;

    return <Container>
      <h2>Options</h2>
      <Form>
        {renderCheckbox( addAction, 'addAction', 'Include simple action (\'alert the ID\')' )}
        {renderCheckbox( emulateError, 'emulateError', 'Emulate error on loading' )}
        {renderCheckbox( emulateLongLoading, 'emulateLongLoading', 'Emulate long loading (add 1 second pause to fetch function)' )}
        {renderCheckbox( selectable, 'selectable', <>Set <code>selectable</code> flag</> )}
        {renderCheckbox( smallSize, 'smallSize', <>Set <code>{'size="sm"'}</code></> )}
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
