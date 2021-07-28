import PageTable, {Action, ActionButtonPropsType, FetchArgs, fetchFromArray}
  from '@vlsergey/react-bootstrap-pagetable';
import React from 'react';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import SyntaxHighlighter from 'react-syntax-highlighter';

import {ExampleData, ExampleItemModel, ExampleItemType} from './ExampleData';

const DropdownActionButton = ({children, onClick, variant, ...etcProps}: ActionButtonPropsType): JSX.Element => {

  const handleClick0 = React.useCallback(() => onClick(0), [onClick]);
  const handleClick2 = React.useCallback(() => onClick(2), [onClick]);
  const handleClick8 = React.useCallback(() => onClick(8), [onClick]);

  return <Dropdown id="dropdown-basic-button" {...etcProps}>
    <Dropdown.Toggle id="dropdown-basic" variant={variant}>
      {children}
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Dropdown.Item eventKey="0" onClick={handleClick0}>JSON without indentation</Dropdown.Item>
      <Dropdown.Item eventKey="2" onClick={handleClick2}>JSON with indent = 2</Dropdown.Item>
      <Dropdown.Item eventKey="8" onClick={handleClick8}>JSON with indent = 8</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>;
};

export default function ActionsDemo (): JSX.Element {

  const actions = React.useMemo(() => [{
    key: 'show-json',
    onAction: (items: ExampleItemType[]) => { alert(JSON.stringify(items, undefined, 2)); },
    refreshAfterAction: false,
    title: 'Show JSON',
    variant: 'primary',
  }, {
    key: 'json-dropdown',
    onAction: (items: ExampleItemType[], indent: number) => { alert(JSON.stringify(items, undefined, indent)); },
    refreshAfterAction: false,
    buttonComponent: DropdownActionButton,
    title: 'Dropdown Example',
    variant: 'primary',
  }] as Action<ExampleItemType>[], []);

  const handleFetch = React.useCallback((fetchArgs: FetchArgs) =>
    fetchFromArray(ExampleItemModel, ExampleData, fetchArgs), []);

  return <Container>
    <Row>
      <p>Display example of Action usage.</p>
    </Row>
    <Row>
      <Col>
        <SyntaxHighlighter language="typescript">
          {`import PageTable, {Action, FetchArgs, fetchFromArray} from '@vlsergey/react-bootstrap-pagetable';

const DropdownActionButton = ({children, onClick, variant, ...etcProps} : ActionButtonPropsType): JSX.Element => {

  const handleClick0 = React.useCallback( () => onClick(0), [onClick] );
  const handleClick2 = React.useCallback( () => onClick(2), [onClick] );
  const handleClick8 = React.useCallback( () => onClick(8), [onClick] );

  return <Dropdown id="dropdown-basic-button" {...etcProps}>
    <Dropdown.Toggle variant={variant} id="dropdown-basic">
      {children}
    </Dropdown.Toggle>

    <Dropdown.Menu>
      <Dropdown.Item onClick={handleClick0} eventKey="0">JSON without indentation</Dropdown.Item>
      <Dropdown.Item onClick={handleClick2} eventKey="2">JSON with indent = 2</Dropdown.Item>
      <Dropdown.Item onClick={handleClick8} eventKey="8">JSON with indent = 8</Dropdown.Item>
    </Dropdown.Menu>
  </Dropdown>;
}

/* ... */
const actions = React.useMemo(() => [ {
  key: 'show-json',
  onAction: (items: ExampleItemType[]) => alert(JSON.stringify(items, undefined, 2)),
  refreshAfterAction: false,
  title: 'Show JSON',
  variant: 'primary',
},{
  key: 'json-dropdown',
  onAction: (items: ExampleItemType[], indent : number) => alert(JSON.stringify(items, undefined, indent)),
  refreshAfterAction: false,
  buttonComponent: DropdownActionButton,
  title: 'Dropdown Example',
  variant: 'primary',
}] as Action<ExampleItemType>[], []);

const handleFetch = React.useCallback((fetchArgs : FetchArgs) =>
  fetchFromArray(ExampleItemModel, ExampleData, fetchArgs), []);

<PageTable
  actions={actions}
  defaultSize={5}
  fetch={handleFetch}
  itemModel={ExampleItemModel} />
`}
        </SyntaxHighlighter>
      </Col>
    </Row>
    <Row>
      <Col>
        <PageTable
          actions={actions}
          defaultSize={5}
          fetch={handleFetch}
          itemModel={ExampleItemModel} />
      </Col>
    </Row>
  </Container>;

}
