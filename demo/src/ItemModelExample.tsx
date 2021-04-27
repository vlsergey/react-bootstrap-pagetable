import PageTable, { FetchArgs, fetchFromArray, ItemModel }
  from '@vlsergey/react-bootstrap-pagetable';
import React, { PureComponent, ReactNode } from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from '@vlsergey/react-bootstrap-button-with-spinner';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import ErrorBoundary from '@vlsergey/react-bootstrap-error-boundary';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

type DataType = Record<string, unknown>;

interface StateType {
  refreshOnDataChange: boolean;
  data: string;
  itemModel: string;
  retryCounter:number;
}

export default class ItemModelExample extends PureComponent<unknown, StateType> {

  state : StateType = {
    data: `[
  { "id": "1", "name": "Alice", "birthday": "2001-02-03" },
  { "id": "2", "name": "Bob", "birthday": "2002-03-04" },
  { "id": "3", "name": "Carl", "birthday": "2003-04-05" }
]`,
    itemModel: `({
  idF: ( { id } ) => id,
  fields: [
    { key: 'name', title: 'Name' },
    {
      key: 'birthday',
      title: 'Birth Date',
      render: ( value ) => new Date( Date.parse( value ) ).toLocaleDateString(),
    },
    {
      key: 'birthyear',
      title: 'Birth Year',
      getter: ( { birthday } ) => new Date( Date.parse( birthday ) ).getFullYear(),
    },
  ]
})`,
    refreshOnDataChange: true,
    retryCounter: 0,
  }

  private pageTableRef = React.createRef<PageTable<DataType>>();

  handleDataChange = ( { currentTarget: { value } } : React.ChangeEvent<HTMLInputElement> ) : void => {
    this.setState( { data: value } );
    if ( this.state.refreshOnDataChange && this.pageTableRef.current ) {
      this.pageTableRef.current.scheduleRefreshNow();
    }
  }

  handleItemModelChange = ( { currentTarget: { value } } : React.ChangeEvent<HTMLInputElement> ) : unknown =>
    this.setState( { itemModel: value } );

  handleRefreshOnDataChangeChange = ( { currentTarget: { checked } } : React.ChangeEvent<HTMLInputElement> ) : unknown =>
    this.setState( { refreshOnDataChange: checked } );

  handleRetry = () : unknown =>
    this.setState( ( { retryCounter } ) => ( { retryCounter: retryCounter + 1 } ) );

  render() : ReactNode {
    const { data, itemModel, refreshOnDataChange } = this.state;

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
        <Form.Group as={Col} controlId="data">
          <Form.Label>Data (JSON)</Form.Label>
          <Form.Control
            as="textarea"
            className="text-monospace"
            name="data"
            onChange={this.handleDataChange}
            rows={20}
            value={data} />
        </Form.Group>
      </Row>
      <Row>
        <Col>
          <Form.Check
            checked={refreshOnDataChange}
            id="refreshOnDataChange"
            label={<>Automatically invoke <code>refresh()</code> on data update</>}
            name="refreshOnDataChange"
            onChange={this.handleRefreshOnDataChangeChange}
            type="checkbox" />
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

  private renderResult() {
    const { data, itemModel } = this.state;

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

    let parsedItemModel : ItemModel<DataType>;
    try {
      parsedItemModel = eval( itemModel ) as ItemModel<DataType>;
    } catch ( err ) {
      const error = err as {message?: string};
      return <Alert variant="danger">
        {'Unable to execute item model JavaScript: '}
        {error.message || JSON.stringify( error )}
      </Alert>;
    }

    /* eslint-disable react/jsx-no-bind */
    return <ErrorBoundary
      errorMessagePrefix="Unable to render pagetable: "
      errorMessageSuffix={<><br /><Button onClick={this.handleRetry}>retry</Button></>}
      key={`ErrorBoundary_${this.state.retryCounter}`}>
      <PageTable
        fetch={( args : FetchArgs ) => fetchFromArray( parsedData, args )}
        itemModel={parsedItemModel}
        ref={this.pageTableRef} />
    </ErrorBoundary>;
  }
}
