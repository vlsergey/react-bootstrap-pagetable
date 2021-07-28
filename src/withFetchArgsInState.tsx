import React from 'react';

import ControlledPropsType from './controlled/ControlledPropsType';
import FetchArgs from './FetchArgs';
import strToSort from './sortable/strToSort';

export type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'fetchArgs' | 'onFetchArgsChange'>;

export interface NewComponentProps<T> {
  defaultPage?: number;
  defaultSize?: number;
  defaultSort?: string | string[];
  // now optional
  onFetchArgsChange?: ControlledPropsType<T>['onFetchArgsChange'];
}

type PropsType<T, P extends RequiredChildComponentProps<T>> =
  NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>;

const withFetchArgsInState =
  <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>) =>
    function WithFetchArgsInState ({
      defaultPage = 0,
      defaultSize = 10,
      defaultSort,
      onFetchArgsChange,
      ...etcProps
    }: PropsType<T, P>): JSX.Element {

      const [fetchArgs, setFetchArgs] = React.useState<FetchArgs>(() => ({
        page: defaultPage,
        size: defaultSize,
        sort: strToSort(defaultSort),
      }));

      const handleFetchArgsChange = React.useCallback((fetchArgs: FetchArgs) => {
        setFetchArgs(fetchArgs);
        if (onFetchArgsChange) {
          return onFetchArgsChange(fetchArgs);
        }
      }, [onFetchArgsChange, setFetchArgs]);

      return <Child
        {...etcProps as unknown as P}
        fetchArgs={fetchArgs}
        onFetchArgsChange={handleFetchArgsChange} />;
    };

export default withFetchArgsInState;
