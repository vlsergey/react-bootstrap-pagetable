import memoizeOne from 'memoize-one';
import React, {PureComponent, ReactNode} from 'react';
import {RouteComponentProps, withRouter} from 'react-router';

import ControlledPropsType from '../controlled/ControlledPropsType';
import FetchArgs from '../FetchArgs';
import ItemModel from '../ItemModel';
import strToSort from '../sortable/strToSort';
import fetchArgsToUrlParams from './fetchArgsToUrlParams';
import urlParamsToFetchArgs from './urlParamsToFetchArgs';

export type RequiredChildComponentProps<T> = Pick<ControlledPropsType<T>, 'fetchArgs' | 'itemModel' | 'onFetchArgsChange'>;

export interface NewComponentProps<T> {
  defaultPage?: number;
  defaultSize?: number;
  defaultSort?: string | string[];
  // optional now
  onFetchArgsChange?: ControlledPropsType<T>['onFetchArgsChange'];
  urlParamsPrefix?: string;
}

type InnerComponentProps<T, P extends RequiredChildComponentProps<T>>
  = RouteComponentProps<unknown> & NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>;

const withReactRouterImpl =
  <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>): React.ComponentType<InnerComponentProps<T, P>> =>
    class RoutedPageTable extends PureComponent<InnerComponentProps<T, P>> {

  static defaultProps = {
    ...Child.defaultProps,
    defaultPage: 0,
    defaultSize: 10,
  } as unknown as Partial<InnerComponentProps<T, P>>;

  getDefaultFetchArgs = memoizeOne(
    (defaultPage: number, defaultSize: number, defaultSort: (string | string[])): Readonly<FetchArgs> =>
      Object.freeze({page: defaultPage, size: defaultSize, sort: strToSort(defaultSort)})
  );

  toFetchArgs = memoizeOne((
    defaultFetchArgs: FetchArgs,
    itemModel: ItemModel<unknown>,
    urlParamsPrefix: string,
    search: string
  ): FetchArgs =>
    urlParamsToFetchArgs(defaultFetchArgs, itemModel, urlParamsPrefix, new URLSearchParams(search))
  );

  handleFetchArgsChange = (fetchArgs: FetchArgs): void => {
    const {defaultPage, defaultSize, defaultSort, history, itemModel,
      location: {pathname, search}, onFetchArgsChange, urlParamsPrefix
    } = this.props;

    const updated: URLSearchParams = fetchArgsToUrlParams(itemModel,
      urlParamsPrefix, search, fetchArgs);
    const newSearch: string = updated.toString();

    if (onFetchArgsChange) {
      const defaultFetchArgs: FetchArgs = this.getDefaultFetchArgs(defaultPage, defaultSize, defaultSort);
      const newFetchArgs: FetchArgs = this.toFetchArgs(defaultFetchArgs, itemModel, urlParamsPrefix, newSearch);
      onFetchArgsChange(newFetchArgs);
    }

    history.replace(`${pathname}?${newSearch}`);
  };

  override render (): ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "history|match|onFetchArgsChange" }] */
    const {defaultPage, defaultSize, defaultSort, itemModel, history, location, match,
      onFetchArgsChange, urlParamsPrefix, ...etcProps} = this.props;

    const defaultFetchArgs: FetchArgs = this.getDefaultFetchArgs(defaultPage, defaultSize, defaultSort);
    const fetchArgs: FetchArgs = this.toFetchArgs(defaultFetchArgs, itemModel, urlParamsPrefix, location.search);
    return <Child
      fetchArgs={fetchArgs}
      itemModel={itemModel}
      onFetchArgsChange={this.handleFetchArgsChange}
      {...etcProps as unknown as P} />;
  }
    };

const withReactRouter =
  <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>): React.ComponentType<NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>> =>
    withRouter(withReactRouterImpl(Child)) as unknown as React.ComponentType<NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>>;

export default withReactRouter;
