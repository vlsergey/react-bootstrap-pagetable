import React from 'react';

import ColumnHeaderCellPropsType from './ColumnHeaderCellPropsType';

function DefaultColumnHeaderCell<T, V> ({
  field
}: ColumnHeaderCellPropsType<T, V>): JSX.Element {
  return <th {...field.headerCellProps}>
    {
      field.headerCellContent
        ? React.createElement(field.headerCellContent, {field})
        : field.title
    }
  </th>;
}

export default React.memo(DefaultColumnHeaderCell) as typeof DefaultColumnHeaderCell;
