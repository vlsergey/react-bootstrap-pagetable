import Button from '@vlsergey/react-bootstrap-button-with-spinner';
import ErrorBoundary from '@vlsergey/react-bootstrap-error-boundary';
import {ControlledWithReactRouter as PageTable, FetchArgs, fetchFromArray, FieldModel, ItemFieldValue,
  useControlledContext, useVisibleFields}
  from '@vlsergey/react-bootstrap-pagetable';
import React, {PureComponent, ReactNode} from 'react';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Container from 'react-bootstrap/Container';

import {ExampleData, ExampleItemModel, ExampleItemType} from './ExampleData';

interface StateType {
  fetchArgs: FetchArgs;
  retryCounter: number;
}

function CustomRowsRenderer (): JSX.Element {
  const {itemModel, page: {content}} = useControlledContext();
  const visibleFields = useVisibleFields();

  return <tr><td colSpan={visibleFields.length}><CardDeck>
    { content.map((item: ExampleItemType) => <Card key={itemModel.idF(item)} style={{width: 250, minWidth: 250, maxWidth: 250}}>
      <Card.Img src={`https://picsum.photos/seed/${item.id}/250/200`} variant="top" />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <ul>
          { visibleFields.map((field: FieldModel<ExampleItemType, unknown>) =>
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
    fetchArgs: {
      page: 0,
      size: 5,
    },
    retryCounter: 0,
  };

  private readonly handleFetchArgsChange = (fetchArgs: FetchArgs) =>
  { this.setState({fetchArgs}); };

  private readonly handleRetry = () =>
  { this.setState(({retryCounter}) => ({retryCounter: retryCounter + 1})); };

  override render (): ReactNode {
    return <Container>
      <p>This page displays custom row renderer example. To render rows react bootstrap CardDeck and Card are used. Filtering, pagination and sroting still works.</p>
      {this.renderResult()}
    </Container>;
  }

  private renderResult (): ReactNode {
    const {fetchArgs} = this.state;

    /* eslint-disable react/jsx-no-bind */
    return <ErrorBoundary
      errorMessagePrefix="Unable to render pagetable: "
      errorMessageSuffix={<><br /><Button onClick={this.handleRetry}>retry</Button></>}
      key={`ErrorBoundary_${this.state.retryCounter}`}>
      <PageTable
        defaultPage={fetchArgs.page}
        defaultSize={fetchArgs.size}
        itemModel={ExampleItemModel}
        onFetchArgsChange={this.handleFetchArgsChange}
        page={fetchFromArray(ExampleItemModel, ExampleData, fetchArgs)}
        rowsRenderer={CustomRowsRenderer} />
    </ErrorBoundary>;
  }
}
