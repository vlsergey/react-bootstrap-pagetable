import React, {PureComponent, ReactNode} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';
import {PropsType as ControlledPropsType} from '../ControlledBase';
import FetchArgs from '../FetchArgs';
import fetchArgsToUrlParams from './fetchArgsToUrlParams';
import ItemModel from '../ItemModel';
import memoizeOne from 'memoize-one';
import urlParamsToFetchArgs from './urlParamsToFetchArgs';

export type RequiredChildComponentProps<T> = Pick<ControlledPropsType<T>, 'fetchArgs' | 'itemModel' | 'onFetchArgsChange'>;

export type NewComponentProps<T> = {
  urlParamsPrefix?: string;
  // optional now
  onFetchArgsChange?: ControlledPropsType<T>['onFetchArgsChange'];
};

type InnerComponentProps<T, P extends RequiredChildComponentProps<T>>
  = RouteComponentProps<unknown> & NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>;

const withReactRouterImpl =
  <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>): React.ComponentType<InnerComponentProps<T, P>> =>
    class RoutedPageTable extends PureComponent<InnerComponentProps<T, P>> {

  toFetchArgs = memoizeOne(
    (itemModel: ItemModel<unknown>, urlParamsPrefix: string, search: string): FetchArgs =>
      urlParamsToFetchArgs(itemModel, urlParamsPrefix, new URLSearchParams(search))
  );

  handleFetchArgsChange = (fetchArgs: FetchArgs): void => {
    const {history, itemModel, location: {search}, onFetchArgsChange,
      urlParamsPrefix} = this.props;

    const updated: URLSearchParams = fetchArgsToUrlParams(itemModel,
      urlParamsPrefix, search, fetchArgs);
    const newSearch: string = updated.toString();

    if (onFetchArgsChange) {
      onFetchArgsChange(this.toFetchArgs(itemModel, urlParamsPrefix, newSearch));
    }

    history.replace(`${location.pathname}?${newSearch}`);
  };

  render (): ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "history|match|onFetchArgsChange" }] */
    const {itemModel, history, location, match, onFetchArgsChange,
      urlParamsPrefix, ...etcProps} = this.props;
    return <Child
      fetchArgs={this.toFetchArgs(itemModel, urlParamsPrefix, location.search)}
      itemModel={itemModel}
      onFetchArgsChange={this.handleFetchArgsChange}
      {...etcProps as unknown as P} />;
  }
    };

const withReactRouter =
  <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>): React.ComponentType<NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>> =>
    withRouter(withReactRouterImpl(Child)) as unknown as React.ComponentType<NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>>;

export default withReactRouter;
