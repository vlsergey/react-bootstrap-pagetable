import React, {ComponentType, useCallback, useMemo} from 'react';
import {useHistory, useLocation} from 'react-router-dom';

import ControlledPropsType from '../controlled/ControlledPropsType';
import FetchArgs from '../FetchArgs';
import strToSort from '../sortable/strToSort';
import fetchArgsToUrlParams from './fetchArgsToUrlParams';
import ReactRouterItemFieldCellLinkWrapper from './ReactRouterItemFieldCellLinkWrapper';
import urlParamsToFetchArgs from './urlParamsToFetchArgs';

export type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'fetchArgs' | 'itemFieldCellLinkWrapper' | 'itemModel' | 'onFetchArgsChange'>;

export interface NewComponentProps<T> {
  defaultPage?: number;
  defaultSize?: number;
  defaultSort?: string | string[];
  // optional now
  onFetchArgsChange?: ControlledPropsType<T>['onFetchArgsChange'];
  urlParamsPrefix?: string;
}

type InnerComponentProps<T, P extends RequiredChildComponentProps<T>>
  = NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>;

const withReactRouter =
  <T, P extends RequiredChildComponentProps<T>>(Child: ComponentType<P>): ComponentType<InnerComponentProps<T, P>> =>

    function RoutedPageTable ({
      defaultPage = 0,
      defaultSize = 10,
      defaultSort,
      itemFieldCellLinkWrapper = ReactRouterItemFieldCellLinkWrapper,
      itemModel,
      onFetchArgsChange,
      urlParamsPrefix,
      ...etcProps
    }: InnerComponentProps<T, P>) {
      const history = useHistory();
      const location = useLocation();

      const defaultFetchArgs = useMemo(() =>
        ({page: defaultPage, size: defaultSize, sort: strToSort(defaultSort)})
      , [defaultPage, defaultSize, defaultSort]);

      const toFetchArgs = useMemo(() => (search: string): FetchArgs =>
        urlParamsToFetchArgs(defaultFetchArgs, itemModel, urlParamsPrefix, new URLSearchParams(search))
      , [defaultFetchArgs, itemModel, urlParamsPrefix]);

      const handleFetchArgsChange = useCallback((fetchArgs: FetchArgs): void => {
        const updated: URLSearchParams = fetchArgsToUrlParams(itemModel,
          urlParamsPrefix, location.search, fetchArgs);
        const newSearch: string = updated.toString();

        if (onFetchArgsChange) {
          const newFetchArgs: FetchArgs = toFetchArgs(newSearch);
          onFetchArgsChange(newFetchArgs);
        }

        history.replace(`${location.pathname}?${newSearch}`);
      }, [history, itemModel, location.pathname, location.search, onFetchArgsChange, toFetchArgs, urlParamsPrefix]);

      const fetchArgs: FetchArgs = toFetchArgs(location.search);
      return <Child
        {...etcProps as unknown as P}
        fetchArgs={fetchArgs}
        itemFieldCellLinkWrapper={itemFieldCellLinkWrapper}
        itemModel={itemModel}
        onFetchArgsChange={handleFetchArgsChange} />;
    };

export default withReactRouter;
