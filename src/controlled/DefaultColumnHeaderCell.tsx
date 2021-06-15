import ColumnHeaderCellPropsType from './ColumnHeaderCellPropsType';
import React from 'react';

const DefaultColumnHeaderCell = ({field}: ColumnHeaderCellPropsType) => <th>
  {field.title}
</th>;

export default React.memo(DefaultColumnHeaderCell) as unknown as (props: ColumnHeaderCellPropsType) => JSX.Element;
