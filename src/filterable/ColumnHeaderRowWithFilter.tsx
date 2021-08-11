import React from 'react';

import {useControlledContext} from '../controlled/ControlledContext';
import useVisibleFields from '../controlled/visibleFields/useVisibleFields';
import FieldModel from '../FieldModel';
import FieldFilterCell from './FieldFilterCell';

function ColumnHeaderRowWithFilter<T> (): JSX.Element {
  const ColumnHeaderRow = useControlledContext<T>().columnHeaderRow;
  const visibleFields: FieldModel<T, unknown>[] = useVisibleFields();

  return <>
    <ColumnHeaderRow />
    <tr>
      {visibleFields.map((field: FieldModel<unknown, unknown>) =>
        <FieldFilterCell field={field} key={field.key} />
      )}
    </tr>
  </>;
}

export default React.memo(ColumnHeaderRowWithFilter);
