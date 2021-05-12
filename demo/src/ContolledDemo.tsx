import { Action, ControlledPageTable, FieldModel, ItemModel, Page,
  singlePage } from '@vlsergey/react-bootstrap-pagetable';
import React, { PureComponent, ReactNode } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import reactElementToJSXString from 'react-element-to-jsx-string';

const NOOP = (): unknown => undefined;

interface StateType {
  addAction: boolean;
  data: {id: string}[];
  hasError: boolean;
  loading: boolean;
  selectable : boolean;
  smallSize : boolean;
}

export default class ContolledDemo extends PureComponent<unknown, StateType> {

  state : StateType = {
    addAction: false,
    data: [ { id: 'A' }, { id: 'B' }, { id: 'C' } ],
    selectable: false,
    hasError: false,
    loading: false,
    smallSize: false,
  }

  private handleCheckboxChange = ( { currentTarget: { checked, name } }: React.ChangeEvent<HTMLInputElement> ) => {
    this.setState( {
      [ name ]: !!checked,
    } as unknown as StateType );
  }

  render() : ReactNode {
    const { addAction, data, hasError, loading, selectable, smallSize } = this.state;
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

    const page : Page<TestType> = singlePage( data );

    const actions = addAction ? [
      {
        key: 'alert',
        title: 'Alert',
        enabled: ( items : TestType[] ) => items.length == 1,
        onAction: ( items : TestType[] ) => alert( items[ 0 ].id ),
      } as Action<TestType>,
    ] as Action<TestType>[] : [];

    const pageTable = <ControlledPageTable
      actions={actions}
      error={null}
      fetchArgs={{ size: 10, page: 0 }}
      hasError={hasError}
      itemModel={itemModel}
      loading={loading}
      onFetchArgsChange={NOOP}
      onRefreshRequired={NOOP}
      page={page}
      selectable={selectable}
      size={smallSize ? 'sm' : undefined} />;

    const renderCheckbox = ( checked : boolean, key : string, label : ReactNode ) =>
      <Form.Check
        checked={checked}
        id={'ctrld_chk_' + key}
        label={label}
        name={key}
        onChange={this.handleCheckboxChange}
        type="checkbox" />;

    return <Container>
      <h2>Options</h2>
      <Form>
        {renderCheckbox( addAction, 'addAction', 'Include simple action (\'alert the ID\')' )}
        {renderCheckbox( hasError, 'hasError', <>Set <code>hasError</code> flag</> )}
        {renderCheckbox( loading, 'loading', <>Set <code>loading</code> flag</> )}
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
