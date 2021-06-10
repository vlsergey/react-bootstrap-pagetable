import {FetchArgs, fetchFromArray, FieldModel,
  FilterCellRendererProps, FilterValueConverter, ItemFieldValue, ItemModel,
  ControlledWithReactRouter as PageTable, RowsRendererPropsType}
  from '@vlsergey/react-bootstrap-pagetable';
import React, {PureComponent, ReactNode, useCallback} from 'react';
import Alert from 'react-bootstrap/Alert';
import Button from '@vlsergey/react-bootstrap-button-with-spinner';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Container from 'react-bootstrap/Container';
import ErrorBoundary from '@vlsergey/react-bootstrap-error-boundary';
import Form from 'react-bootstrap/Form';

type DataType = Record<string, unknown>;

interface StateType {
  data: string;
  fetchArgs: FetchArgs;
  retryCounter: number;
}

type TestType = {
  id: string;
  name: string;
  birthday: string;
};

const FilterCell = ({filterBy, onFilterByChange}: FilterCellRendererProps<TestType, string, string>) =>
  <td>
    <Form.Control
      onChange={useCallback(
        ({currentTarget: {value}}: React.ChangeEvent<HTMLInputElement>) => onFilterByChange(value)
        , [ onFilterByChange ])}
      placeholder="value to filter by (show values that contains entered text)"
      type="text"
      value={filterBy || ''} />
  </td>;

const filterValueConverter: FilterValueConverter<string> = {
  fromString: (str: string) => str,
  toString: (str: string) => str,
};

const ITEM_MODEL: ItemModel<TestType> = {
  idF: ({id}: TestType) => id,
  fields: [
    {
      key: 'name',
      title: 'Name',
      sortable: true,
      filterValueConverter,
      renderFilterCell: FilterCell
    } as FieldModel<TestType, string>,
    {
      key: 'birthday',
      title: 'Birth Date',
      render: ({value}: {value: string}) => new Date(Date.parse(value)).toLocaleDateString(),
      sortable: true,
    },
    {
      key: 'birthyear',
      title: 'Birth Year',
      getter: ({birthday}: TestType) => new Date(Date.parse(birthday)).getFullYear(),
      sortable: true,
    },
  ]
};

function CustomRowsRenderer ({fieldsToRender, itemModel, items}: RowsRendererPropsType<TestType>): JSX.Element {
  return <tr><td colSpan={fieldsToRender.length + 1}><CardDeck>
    { items.map((item: TestType) => <Card key={itemModel.idF(item)} style={{width: 250, minWidth: 250, maxWidth: 250}}>
      <Card.Img src={`https://picsum.photos/seed/${item.id}/250/200`} variant="top" />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <ul>
          { fieldsToRender.map((field: FieldModel<TestType, unknown>) =>
            <li key={field.key}>
              <b>{field.title}</b>{': '}
              <ItemFieldValue field={field} item={item} itemModel={itemModel} />
            </li>
          ) }
        </ul>
      </Card.Body>
      <Card.Footer>
        <small className="text-muted">ID: {item.id}</small>
      </Card.Footer>
    </Card>) }
  </CardDeck></td></tr>;
}

export default class CustomRowRendererDemo extends PureComponent<unknown, StateType> {

  override state: StateType = {
    data: `[
  { "id": "1", "name": "Alice", "birthday": "2001-02-03" },
  { "id": "2", "name": "Bob", "birthday": "2002-03-04" },
  { "id": "3", "name": "Carl", "birthday": "2003-04-05" },
  { "id": "4", "name": "David", "birthday": "2004-05-06" },
  { "id": "5", "name": "Eva", "birthday": "2005-06-07" },
  { "id": "6", "name": "Fiona", "birthday": "2006-07-08" },
  { "id": "7", "name": "Helen", "birthday": "2007-08-09" }
]`,
    fetchArgs: {
      page: 0,
      size: 5,
    },
    retryCounter: 0,
  };

  private handleFetchArgsChange = (fetchArgs: FetchArgs) =>
    this.setState({fetchArgs});

  private handleRetry = (): unknown =>
    this.setState(({retryCounter}) => ({retryCounter: retryCounter + 1}));

  override render (): ReactNode {
    return <Container>
      <p>This page displays custom row renderer example. To render rows react bootstrap CardDeck and Card are used. Filtering, pagination and sroting still works.</p>
      {this.renderResult()}
    </Container>;
  }

  private renderResult (): ReactNode {
    const {data, fetchArgs} = this.state;

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

    /* eslint-disable react/jsx-no-bind */
    return <ErrorBoundary
      errorMessagePrefix="Unable to render pagetable: "
      errorMessageSuffix={<><br /><Button onClick={this.handleRetry}>retry</Button></>}
      key={`ErrorBoundary_${this.state.retryCounter}`}>
      <PageTable
        defaultPage={fetchArgs.page}
        defaultSize={fetchArgs.size}
        itemModel={ITEM_MODEL}
        onFetchArgsChange={this.handleFetchArgsChange}
        page={fetchFromArray(ITEM_MODEL, parsedData, fetchArgs)}
        rowsRenderer={CustomRowsRenderer} />
    </ErrorBoundary>;
  }
}
