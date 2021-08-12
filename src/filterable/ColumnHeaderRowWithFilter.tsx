import React from 'react';

import DefaultColumnHeaderRow from '../controlled/DefaultColumnHeaderRow';
import useVisibleFields from '../controlled/visibleFields/useVisibleFields';
import FieldModel from '../FieldModel';
import FieldFilterCell from './FieldFilterCell';

function ColumnHeaderRowWithFilter<T> (): JSX.Element {
  const visibleFields: FieldModel<T, unknown>[] = useVisibleFields();

  return <>
    <DefaultColumnHeaderRow />
    <tr>
      {visibleFields.map(field =>
        <FieldFilterCell field={field} key={field.key} />
      )}
    </tr>
  </>;
}

export default React.memo(ColumnHeaderRowWithFilter);
