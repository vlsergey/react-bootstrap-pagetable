import React, {useMemo} from 'react';

import ControlledPropsType from '../controlled/ControlledPropsType';
import ColumnHeaderRowWithFilter from './ColumnHeaderRowWithFilter';

type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'columnHeaderCell' | 'columnHeaderRow' | 'fetchArgs' | 'itemModel' | 'onFetchArgsChange'>;

const withFilterable = <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>): React.ComponentType<P> =>
  function WithFilterable ({
    fetchArgs,
    itemModel,
    onFetchArgsChange
  }: P) {

    const tableFilterable = useMemo(() =>
      itemModel.fields.some(({renderFilterCell}) => !!renderFilterCell)
    , [itemModel]);

    if (!tableFilterable) {
      return <Child
        {...etcProps as P}
        fetchArgs={fetchArgs}
        itemModel={itemModel}
        onFetchArgsChange={onFetchArgsChange} />;
    }

    return <Child
      {...etcProps as P}
      columnHeaderRow={ColumnHeaderRowWithFilter}
      fetchArgs={fetchArgs}
      itemModel={itemModel}
      onFetchArgsChange={onFetchArgsChange} />;
  };

export default withFilterable;
