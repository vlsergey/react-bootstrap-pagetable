import {Action, FetchArgs, fetchFromArray, FieldModel, ItemModel, Page,
  UncontrolledPageTable as PageTable} from '@vlsergey/react-bootstrap-pagetable';
import React, {PureComponent, ReactNode} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import reactElementToJSXString from 'react-element-to-jsx-string';

interface StateType {
  addAction: boolean;
  emulateError: boolean;
  emulateLongLoading: boolean;
  selectable: boolean;
  size?: 'lg' | 'sm';
}

function sleep (ms: number): Promise< unknown > {
  return new Promise(resolve => setTimeout(resolve, ms));
}

interface TestType {id: string}

const itemModel: ItemModel<TestType> = {
  idF: ({id}: TestType) => id,
  fields: [
    {
      key: 'id',
      render: ({value}) => value as unknown as JSX.Element,
      title: 'ID',
    } as FieldModel<TestType, string, unknown>,
  ] as FieldModel<TestType, unknown, unknown>[],
};

const sourceDataArray: TestType[] =
  ([...(Array(10000) as unknown[]).keys()] as number[])
    .map((key: number) => ({id: String(key)}));

export default class UncontrolledDemo extends PureComponent<unknown, StateType> {

  override state: StateType = {
    addAction: false,
    selectable: false,
    emulateError: false,
    emulateLongLoading: false,
    size: undefined,
  };

  private readonly fetchData = async (fetchArgs: FetchArgs): Promise<Page<TestType>> => {
    const {emulateError, emulateLongLoading} = this.state;
    if (emulateLongLoading) {
      await sleep(1000);
    }
    if (emulateError) {
      throw new Error('Unable to load page (emulated error)');
    }
    return fetchFromArray(itemModel, sourceDataArray, fetchArgs);
  };

  private readonly handleCheckboxChange = ({currentTarget: {checked, name}}: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [name]: !!checked,
    } as unknown as StateType);
  };

  private readonly handleSelectChange = ({currentTarget: {name, value}}: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [name]: value || undefined,
    } as unknown as StateType);
  };

  override render (): ReactNode {
    const {addAction, emulateError, emulateLongLoading, selectable, size} = this.state;

    const actions = addAction ? [
      {
        key: 'alert',
        title: 'Alert item ID',
        enabled: (items: TestType[]) => items.length == 1,
        onAction: (items: TestType[]) => items.map(item => { alert(item.id); }),
      } as Action<TestType>,
    ] as Action<TestType>[] : [];

    const pageTable = <PageTable
      actions={actions}
      fetch={this.fetchData}
      itemModel={itemModel}
      selectable={selectable}
      size={size} />;

    const renderCheckbox = (checked: boolean, key: string, label: ReactNode) =>
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
        {renderCheckbox(addAction, 'addAction', 'Include simple action (\'alert the ID\')')}
        {renderCheckbox(emulateError, 'emulateError', 'Emulate error on loading')}
        {renderCheckbox(emulateLongLoading, 'emulateLongLoading', 'Emulate long loading (add 1 second pause to fetch function)')}
        {renderCheckbox(selectable, 'selectable', <>Set <code>selectable</code> flag</>)}
        <Form.Group className="form-inline" controlId="size">
          <Form.Label style={{paddingRight: '1em'}}>Size:</Form.Label>
          <Form.Control as="select" name="size" onChange={this.handleSelectChange} size="sm" value={size || ''}>
            <option value="sm">sm</option>
            <option value="" />
            <option value="lg">lg</option>
          </Form.Control>
        </Form.Group>
      </Form>
      <h2>Result</h2>
      {pageTable}
      <h2>JSX</h2>
      <pre>{reactElementToJSXString(pageTable, {
        showDefaultProps: false,
        showFunctions: true,
        tabStop: 2,
      })}</pre>
    </Container>;
  }

}
