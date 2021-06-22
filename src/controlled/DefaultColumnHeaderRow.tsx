import FieldModel from '../FieldModel';
import React from 'react';
import {useControlledContext} from './ControlledContext';
import useVisibleFields from './visibleFields/useVisibleFields';

function DefaultColumnHeaderRow<T> (): JSX.Element {
  const {columnHeaderCell} = useControlledContext();
  const visibleFields: FieldModel<T, unknown>[] = useVisibleFields();

  const ColumnHeaderCell = columnHeaderCell;
  return <tr>{visibleFields.map((field: FieldModel<unknown, unknown>) =>
    <ColumnHeaderCell field={field} key={field.key} />
  )}</tr>;
}

export default React.memo(DefaultColumnHeaderRow);
