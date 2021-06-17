import {ExampleData, ExampleItemModel, ExampleItemType} from './ExampleData';
import {FetchArgs, fetchFromArray, ControlledWithReactRouter as PageTable}
  from '@vlsergey/react-bootstrap-pagetable';
import React, {PureComponent, ReactNode} from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from '@vlsergey/react-bootstrap-button-with-spinner';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ErrorBoundary from '@vlsergey/react-bootstrap-error-boundary';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SyntaxHighlighter from 'react-syntax-highlighter';

interface StateType {
  data: string;
  fetchArgs: FetchArgs;
  retryCounter: number;
}

export default class RoutedExample extends PureComponent<unknown, StateType> {

  override state: StateType = {
    data: JSON.stringify(ExampleData, undefined, 2),
    fetchArgs: {
      page: 0,
      size: 5,
    },
    retryCounter: 0,
  };

  private handleDataChange =
    ({currentTarget: {value}}: React.ChangeEvent<HTMLInputElement>): void =>
      this.setState({data: value});

  private handleFetchArgsChange = (fetchArgs: FetchArgs) =>
    this.setState({fetchArgs});

  private handleFetchArgsTextChange =
    ({currentTarget: {value}}: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({fetchArgs: JSON.parse(value) as FetchArgs});

  private handleRetry = (): unknown =>
    this.setState(({retryCounter}) => ({retryCounter: retryCounter + 1}));

  override render (): ReactNode {
    const {data, fetchArgs} = this.state;

    return <Container>
      <Row>
        <p>This page displays integration between PageTable and <a href="https://reactrouter.com/">react-router</a>. Try to change filters, page, page size or sorting and notice change in page URL.</p>
      </Row>
      <Row>
        <Col>
          <h3>Controlled</h3>
          <SyntaxHighlighter language="typescript">
            {`import { FetchArgs, fetchFromArray, FieldModel, ItemModel,
  ControlledWithReactRouter as PageTable }
  from '@vlsergey/react-bootstrap-pagetable';

/* ... */

<PageTable
  fetchArgs={fetchArgs}
  itemModel={ITEM_MODEL}
  onFetchArgsChange={this.handleFetchArgsChange}
  page={fetchFromArray( ITEM_MODEL, data, fetchArgs )} />;
`}
          </SyntaxHighlighter>
        </Col>
        <Col>
          <h3>Uncontrolled</h3>
          <SyntaxHighlighter language="typescript">
            {`import { FetchArgs, FieldModel, fetchFromArray, ItemModel,
  UncontrolledWithReactRouter as PageTable }
  from '@vlsergey/react-bootstrap-pagetable';

/* ... */

<PageTable
  itemModel={ITEM_MODEL}
  fetch={(fetchArgs: FetchArgs) =>
    fetchFromArray( ITEM_MODEL, data, fetchArgs )} />;
`}
          </SyntaxHighlighter>
        </Col>
      </Row>
      <Row>
        <Form.Group as={Col} controlId="data">
          <Form.Label>Data (JSON)</Form.Label>
          <Form.Control
            as="textarea"
            className="text-monospace"
            name="data"
            onChange={this.handleDataChange}
            rows={5}
            value={data} />
        </Form.Group>
        { !!Object.keys(fetchArgs).length && <Form.Group as={Col} controlId="fetchArgs">
          <Form.Label>FetchArgs</Form.Label>
          <Form.Control
            as="textarea"
            className="text-monospace"
            name="fetchArgs"
            onChange={this.handleFetchArgsTextChange}
            rows={5}
            value={JSON.stringify(fetchArgs, undefined, 2)} />
        </Form.Group> }
      </Row>
      <Row>
        <Col>
          <h2>Result (using <code>fetchFromArray()</code>)</h2>
          {this.renderResult()}
        </Col>
      </Row>
    </Container>;
  }

  private renderResult (): ReactNode {
    const {data, fetchArgs} = this.state;

    let parsedData: ExampleItemType[];
    try {
      parsedData = JSON.parse(data) as ExampleItemType[];
    } catch (err) {
      const error = err as {message?: string};
      return <Alert variant="danger">
        {'Unable to parse data JSON: '}
        {error.message || JSON.stringify(error)}
      </Alert>;
    }

    /* eslint-disable react/jsx-no-bind */
    return <ErrorBoundary
      errorMessagePrefix="Unable to render pagetable: "
      errorMessageSuffix={<><br /><Button onClick={this.handleRetry}>retry</Button></>}
      key={`ErrorBoundary_${this.state.retryCounter}`}>
      <PageTable
        defaultPage={fetchArgs.page}
        defaultSize={fetchArgs.size}
        defaultSort="name,ASC"
        itemModel={ExampleItemModel}
        onFetchArgsChange={this.handleFetchArgsChange}
        page={fetchFromArray(ExampleItemModel, parsedData, fetchArgs)} />
    </ErrorBoundary>;
  }
}
