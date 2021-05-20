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
  defaultPage?: number;
  defaultSize?: number;
  // optional now
  onFetchArgsChange?: ControlledPropsType<T>['onFetchArgsChange'];
  urlParamsPrefix?: string;
};

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
    (defaultPage: number, defaultSize: number): FetchArgs =>
      ({page: defaultPage, size: defaultSize})
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
    const {defaultPage, defaultSize, history, itemModel,
      location: {pathname, search}, onFetchArgsChange, urlParamsPrefix
    } = this.props;

    const updated: URLSearchParams = fetchArgsToUrlParams(itemModel,
      urlParamsPrefix, search, fetchArgs);
    const newSearch: string = updated.toString();

    if (onFetchArgsChange) {
      const defaultFetchArgs: FetchArgs = this.getDefaultFetchArgs(defaultPage, defaultSize);
      const newFetchArgs: FetchArgs = this.toFetchArgs(defaultFetchArgs, itemModel, urlParamsPrefix, newSearch);
      onFetchArgsChange(newFetchArgs);
    }

    history.replace(`${pathname}?${newSearch}`);
  };

  render (): ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "history|match|onFetchArgsChange" }] */
    const {defaultPage, defaultSize, itemModel, history, location, match,
      onFetchArgsChange, urlParamsPrefix, ...etcProps} = this.props;

    const defaultFetchArgs: FetchArgs = this.getDefaultFetchArgs(defaultPage, defaultSize);
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
