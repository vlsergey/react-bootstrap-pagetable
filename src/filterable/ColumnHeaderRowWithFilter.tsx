import React from 'react';

import ControlledPropsType from '../controlled/ControlledPropsType';
import DefaultColumnHeaderRow from '../controlled/DefaultColumnHeaderRow';
import useVisibleFields from '../controlled/visibleFields/useVisibleFields';
import FieldModel from '../FieldModel';
import FieldFilterCell from './FieldFilterCell';

const ColumnHeaderRowWithFilterImpl = (
  {columnHeaderRow}: Pick<ControlledPropsType<unknown>, 'columnHeaderRow'>
): JSX.Element => {
  const visibleFields: FieldModel<unknown, unknown>[] = useVisibleFields();
  const ColumnHeaderRow = columnHeaderRow || DefaultColumnHeaderRow;

  return <>
    <ColumnHeaderRow />
    <tr>
      {visibleFields.map((field: FieldModel<unknown, unknown>) =>
        <FieldFilterCell field={field} key={field.key} />
      )}
    </tr>
  </>;
};

export default React.memo(ColumnHeaderRowWithFilterImpl);
