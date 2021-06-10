import {FetchArgs, fetchFromArray, ItemModel, ControlledPageTable as PageTable}
  from '@vlsergey/react-bootstrap-pagetable';
import React, {PureComponent, ReactNode} from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from '@vlsergey/react-bootstrap-button-with-spinner';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ErrorBoundary from '@vlsergey/react-bootstrap-error-boundary';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

type DataType = Record<string, unknown>;

interface StateType {
  data: string;
  fetchArgs: FetchArgs;
  itemModel: string;
  retryCounter: number;
}

export default class ItemModelExample extends PureComponent<unknown, StateType> {

  override state: StateType = {
    data: `[
  { "id": "1", "name": "Alice", "birthday": "2001-02-03" },
  { "id": "2", "name": "Bob", "birthday": "2002-03-04" },
  { "id": "3", "name": "Carl", "birthday": "2003-04-05" }
]`,
    fetchArgs: {
      page: 0,
      size: 5,
    },
    itemModel: `({
  idF: function( item ) { return item.id; },
  fields: [
    { key: 'name', title: 'Name', sortable: true },
    {
      key: 'birthday',
      title: 'Birth Date',
      render: function( value ){ return new Date( Date.parse( value ) ).toLocaleDateString(); },
      sortable: true,
    },
    {
      key: 'birthyear',
      title: 'Birth Year',
      getter: function( item ) { return new Date( Date.parse( item.birthday ) ).getFullYear(); },
      sortable: true,
    },
  ]
})`,
    retryCounter: 0,
  };

  private handleDataChange =
    ({currentTarget: {value}}: React.ChangeEvent<HTMLInputElement>): void =>
      this.setState({data: value});

  private handleFetchArgsChange = (fetchArgs: FetchArgs): void =>
    this.setState({fetchArgs});

  private handleFetchArgsTextChange =
    ({currentTarget: {value}}: React.ChangeEvent<HTMLInputElement>) =>
      this.setState({fetchArgs: JSON.parse(value) as FetchArgs});

  private handleItemModelChange =
    ({currentTarget: {value}}: React.ChangeEvent<HTMLInputElement>): unknown =>
      this.setState({itemModel: value});

  private handleRetry = (): unknown =>
    this.setState(({retryCounter}) => ({retryCounter: retryCounter + 1}));

  override render (): ReactNode {
    const {data, fetchArgs, itemModel} = this.state;

    return <Container>
      <Row>
        <Form.Group as={Col} controlId="itemModel">
          <Form.Label>Item Model (JavaScript)</Form.Label>
          <Form.Control
            as="textarea"
            className="text-monospace"
            name="itemModel"
            onChange={this.handleItemModelChange}
            rows={20}
            value={itemModel} />
        </Form.Group>
        <Col>
          <Row>
            <Form.Group as={Col} controlId="data">
              <Form.Label>Data (JSON)</Form.Label>
              <Form.Control
                as="textarea"
                className="text-monospace"
                name="data"
                onChange={this.handleDataChange}
                rows={8}
                value={data} />
            </Form.Group>
          </Row>
          { !!Object.keys(fetchArgs).length && <Row>
            <Form.Group as={Col} controlId="fetchArgs">
              <Form.Label>FetchArgs</Form.Label>
              <Form.Control
                as="textarea"
                className="text-monospace"
                name="fetchArgs"
                onChange={this.handleFetchArgsTextChange}
                rows={8}
                value={JSON.stringify(fetchArgs, undefined, 2)} />
            </Form.Group>
          </Row>}
        </Col>
      </Row>
      <Row>
        <Col>
          <h2>Result</h2>
          {this.renderResult()}
        </Col>
      </Row>
    </Container>;
  }

  renderResult (): ReactNode {
    const {data, fetchArgs, itemModel} = this.state;

    let parsedData: DataType[];
    try {
      parsedData = JSON.parse(data) as DataType[];
    } catch (err) {
      const error = err as {message?: string};
      return <Alert variant="danger">
        {'Unable to parse data JSON: '}
        {error.message || JSON.stringify(error)}
      </Alert>;
    }

    let parsedItemModel: ItemModel<DataType>;
    try {
      parsedItemModel = eval(itemModel) as ItemModel<DataType>;
    } catch (err) {
      const error = err as {message?: string};
      return <Alert variant="danger">
        {'Unable to execute item model JavaScript: '}
        {error.message || JSON.stringify(error)}
      </Alert>;
    }

    /* eslint-disable react/jsx-no-bind */
    return <ErrorBoundary
      errorMessagePrefix="Unable to render pagetable: "
      errorMessageSuffix={<><br /><Button onClick={this.handleRetry}>retry</Button></>}
      key={`ErrorBoundary_${this.state.retryCounter}`}>
      <PageTable
        fetchArgs={fetchArgs}
        itemModel={parsedItemModel}
        onFetchArgsChange={this.handleFetchArgsChange}
        page={fetchFromArray(parsedItemModel, parsedData, fetchArgs)} />
    </ErrorBoundary>;
  }
}
