import { FetchArgs, fetchFromArray, FieldFilterCellRenderer,
  FieldFilterValueConverter, FieldModel, ItemModel,
  ControlledWithReactRouter as PageTable }
  from '@vlsergey/react-bootstrap-pagetable';
import React, { PureComponent, ReactNode } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from '@vlsergey/react-bootstrap-button-with-spinner';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ErrorBoundary from '@vlsergey/react-bootstrap-error-boundary';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import SyntaxHighlighter from 'react-syntax-highlighter';

type DataType = Record<string, unknown>;

interface StateType {
  data: string;
  fetchArgs: FetchArgs;
  retryCounter:number;
}

type TestType = {
  id: string,
  name: string,
  birthday: string,
}

class FilterCell extends PureComponent<{
  filterBy: string,
  onChange: ( filterBy : string ) => unknown
}> {

  private handleChange = ( { currentTarget: { value } }: React.ChangeEvent<HTMLInputElement> ) : unknown =>
    this.props.onChange( !value ? null : value );

  render() : ReactNode {
    return <td>
      <Form.Control
        onChange={this.handleChange}
        placeholder="value to filter by (show values that contains entered text)"
        type="text"
        value={this.props.filterBy || ''} />
    </td>;
  }
}

const filterValueConverter : FieldFilterValueConverter<string> = {
  fromString: ( str : string ) => str,
  toString: ( str : string ) => str,
};

const renderFilterByContainsCell : FieldFilterCellRenderer<string, unknown> =
  ( { key } : FieldModel<string>, filterBy: string, onChange : ( ( filterBy: string ) => unknown ) ) =>
    <FilterCell filterBy={filterBy} key={key} onChange={onChange} />;

const ITEM_MODEL : ItemModel<TestType> = {
  idF: ( { id } : TestType ) => id,
  fields: [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      filterValueConverter,
      renderFilterCell: renderFilterByContainsCell,
    },
    {
      key: 'birthday',
      title: 'Birth Date',
      render: ( value : string ) => new Date( Date.parse( value ) ).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'birthyear',
      title: 'Birth Year',
      getter: ( { birthday } : TestType ) => new Date( Date.parse( birthday ) ).getFullYear(),
      sortable: true,
    },
  ]
};

export default class RoutedExample extends PureComponent<unknown, StateType> {

  state : StateType = {
    data: `[
  { "id": "1", "name": "Alice", "birthday": "2001-02-03" },
  { "id": "2", "name": "Bob", "birthday": "2002-03-04" },
  { "id": "3", "name": "Carl", "birthday": "2003-04-05" },
  { "id": "4", "name": "David", "birthday": "2004-05-06" },
  { "id": "5", "name": "Eva", "birthday": "2005-06-07" },
  { "id": "6", "name": "Fiona", "birthday": "2006-07-08" },
  { "id": "7", "name": "Helen", "birthday": "2007-08-09" }
]`,
    fetchArgs: {},
    retryCounter: 0,
  }

  private handleDataChange =
    ( { currentTarget: { value } } : React.ChangeEvent<HTMLInputElement> ) : void =>
      this.setState( { data: value } )

  private handleFetchArgsChange = ( fetchArgs: FetchArgs ) =>
    this.setState( { fetchArgs } );

  private handleFetchArgsTextChange =
    ( { currentTarget: { value } } : React.ChangeEvent<HTMLInputElement> ) =>
      this.setState( { fetchArgs: JSON.parse( value ) as FetchArgs } );

  private handleRetry = () : unknown =>
    this.setState( ( { retryCounter } ) => ( { retryCounter: retryCounter + 1 } ) );

  render() : ReactNode {
    const { data, fetchArgs } = this.state;

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
        { !!Object.keys( fetchArgs ).length && <Form.Group as={Col} controlId="fetchArgs">
          <Form.Label>FetchArgs</Form.Label>
          <Form.Control
            as="textarea"
            className="text-monospace"
            name="fetchArgs"
            onChange={this.handleFetchArgsTextChange}
            rows={5}
            value={JSON.stringify( fetchArgs, undefined, 2 )} />
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

  private renderResult() : ReactNode {
    const { data, fetchArgs } = this.state;

    let parsedData : DataType[];
    try {
      parsedData = JSON.parse( data ) as DataType[];
    } catch ( err ) {
      const error = err as {message?: string};
      return <Alert variant="danger">
        {'Unable to parse data JSON: '}
        {error.message || JSON.stringify( error )}
      </Alert>;
    }

    /* eslint-disable react/jsx-no-bind */
    return <ErrorBoundary
      errorMessagePrefix="Unable to render pagetable: "
      errorMessageSuffix={<><br /><Button onClick={this.handleRetry}>retry</Button></>}
      key={`ErrorBoundary_${this.state.retryCounter}`}>
      <PageTable
        itemModel={ITEM_MODEL}
        onFetchArgsChange={this.handleFetchArgsChange}
        page={fetchFromArray( ITEM_MODEL, parsedData, fetchArgs )} />
    </ErrorBoundary>;
  }
}
