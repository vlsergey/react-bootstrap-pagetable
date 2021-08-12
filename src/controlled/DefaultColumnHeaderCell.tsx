import React from 'react';

import ColumnHeaderCellPropsType from './ColumnHeaderCellPropsType';

function DefaultColumnHeaderCell<T, V, F> ({
  field
}: ColumnHeaderCellPropsType<T, V, F>): JSX.Element {
  const headerCellContent = field.headerCellContent as (undefined | React.FC<ColumnHeaderCellPropsType<T, V, F>>);

  return <th {...field.headerCellProps}>
    {
      headerCellContent
        ? React.createElement(headerCellContent, {field})
        : field.title
    }
  </th>;
}

export default React.memo(DefaultColumnHeaderCell) as typeof DefaultColumnHeaderCell;
