import {ExampleData, ExampleItemModel, ExampleItemType} from './ExampleData';
import PageTable, {Action, FetchArgs, fetchFromArray} from '@vlsergey/react-bootstrap-pagetable';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import React from 'react';
import Row from 'react-bootstrap/Row';
import SyntaxHighlighter from 'react-syntax-highlighter';

export default function ActionsDemo (): JSX.Element {

  const actions = React.useMemo(() => [ {
    enabled: (items: ExampleItemType[]) => items.length !== 0,
    /** Unique action key */
    key: 'show-json',
    /** Execute action on specified items. Can return Promise */
    onAction: (items: ExampleItemType[]) => alert(JSON.stringify(items, undefined, 2)),
    /** Shall we refresh page table content after action completed? */
    refreshAfterAction: false,
    /** Title for button under the pagetable */
    title: 'Show JSON',
    /** What shall be variant for button under the pagetable */
    variant: 'primary',
    visible: () => true,
  } as Action<ExampleItemType> ], []);

  const handleFetch = React.useCallback((fetchArgs : FetchArgs) =>
    fetchFromArray(ExampleItemModel, ExampleData, fetchArgs), []);

  return <Container>
    <Row>
      <p>Display example of Action usage.</p>
    </Row>
    <Row>
      <Col>
        <SyntaxHighlighter language="typescript">
          {`import PageTable, {Action, FetchArgs, fetchFromArray} from '@vlsergey/react-bootstrap-pagetable';

/* ... */
const actions = React.useMemo(() => [{
  enabled: (items: ExampleItemType[]) => items.length !== 0,
  /** Unique action key */
  key: 'show-json',
  /** Execute action on specified items. Can return Promise */
  onAction: (items: ExampleItemType[]) => alert(JSON.stringify( items, undefined, 2 )),
  /** Shall we refresh page table content after action completed? */
  refreshAfterAction: false,
  /** Title for button under the pagetable */
  title: 'Show JSON',
  /** What shall be variant for button under the pagetable */
  variant: 'primary',
  visible: () => true,
} as Action<ExampleItemType>], []);

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
