import {Action, ControlledPageTable, Page, singlePage}
  from '@vlsergey/react-bootstrap-pagetable';
import {ExampleData, ExampleItemModel, ExampleItemType} from "./ExampleData";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import React from 'react';
import reactElementToJSXString from 'react-element-to-jsx-string';
import useBooleanOption from './useBooleanOption';
import useSizeOption from './useSizeOption';

const NOOP = (): unknown => undefined;

export default function ContolledDemo(): JSX.Element {

  const [addAction, addActionFormElement] = useBooleanOption('addAction', 'Include simple action (\'alert the ID\')');
  const [hasError, hasErrorFormElement] = useBooleanOption('hasError', <>Set <code>hasError</code> flag</>);
  const [loading, loadingFormElement] = useBooleanOption('loading', <>Set <code>loading</code> flag</>);
  const [selectable, selectableFormElement] = useBooleanOption('selectable', <>Set <code>selectable</code> flag</>);
  const [size, sizeFormElement] = useSizeOption();

  const page: Page<ExampleItemType> = singlePage(ExampleData);

  const actions = addAction ? [
    {
      key: 'stringify',
      title: 'JSON.stringify',
      onAction: (items: ExampleItemType[]) => alert(JSON.stringify(items)),
    } as Action<ExampleItemType>,
  ] as Action<ExampleItemType>[] : [];

  const pageTable = <ControlledPageTable
    actions={actions}
    error={null}
    fetchArgs={{size: 10, page: 0}}
    hasError={hasError}
    itemModel={ExampleItemModel}
    loading={loading}
    onFetchArgsChange={NOOP}
    onRefreshRequired={NOOP}
    page={page}
    selectable={selectable}
    size={size} />;

  return <Container>
    <h2>Options</h2>
    <Form>
      {addActionFormElement}
      {hasErrorFormElement}
      {loadingFormElement}
      {selectableFormElement}
      {sizeFormElement}
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
