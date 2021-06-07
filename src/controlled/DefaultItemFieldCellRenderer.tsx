import ItemFieldCellRendererPropsType from './ItemFieldCellRendererPropsType';
import ItemFieldValue from '../ItemFieldValue';
import React from 'react';

export type PropsType<ItemType, ValueType> =
  ItemFieldCellRendererPropsType<ItemType, ValueType> &
  React.ComponentProps<'td'>;

function DefaultItemFieldCellRenderer<ItemType, ValueType> (
    {field, item, itemModel, ...etc}: PropsType<ItemType, ValueType>
): JSX.Element {
  return <td {...etc}>
    <ItemFieldValue field={field} item={item} itemModel={itemModel} />
  </td>;
}

const DefaultItemFieldCellRendererMemoized = React.memo(DefaultItemFieldCellRenderer);
export default DefaultItemFieldCellRendererMemoized;
