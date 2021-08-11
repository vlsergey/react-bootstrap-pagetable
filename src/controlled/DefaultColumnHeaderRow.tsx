import React from 'react';

import {useControlledContext} from './ControlledContext';
import useVisibleFields from './visibleFields/useVisibleFields';

function DefaultColumnHeaderRow<T> (): JSX.Element {
  const {columnHeaderCell} = useControlledContext<T>();
  const visibleFields = useVisibleFields<T>();

  const ColumnHeaderCell = columnHeaderCell;
  return <tr>{visibleFields.map(field =>
    <ColumnHeaderCell field={field} key={field.key} />
  )}</tr>;
}

export default React.memo(DefaultColumnHeaderRow);
