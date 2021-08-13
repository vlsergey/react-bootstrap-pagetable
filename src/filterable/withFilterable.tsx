import React, {useMemo} from 'react';

import ControlledPropsType from '../controlled/ControlledPropsType';
import ColumnHeaderRowWithFilter from './ColumnHeaderRowWithFilter';

type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'columnHeaderRow' | 'itemModel' >;

const withFilterable = <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>) =>
  function WithFilterable ({
    columnHeaderRow,
    itemModel,
    ...etcProps
  }: P): JSX.Element {
    const tableFilterable = useMemo(() =>
      itemModel.fields.some(({renderFilterCell}) => !!renderFilterCell)
    , [itemModel]);

    if (!tableFilterable || !!columnHeaderRow) {
      return <Child
        {...etcProps as P}
        columnHeaderRow={columnHeaderRow}
        itemModel={itemModel} />;
    }

    return <Child
      {...etcProps as P}
      columnHeaderRow={ColumnHeaderRowWithFilter}
      itemModel={itemModel} />;
  };

export default withFilterable;
