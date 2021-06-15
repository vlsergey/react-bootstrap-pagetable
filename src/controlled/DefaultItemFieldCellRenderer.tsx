import ItemFieldCellRendererPropsType from './ItemFieldCellRendererPropsType';
import ItemFieldValue from '../ItemFieldValue';
import React from 'react';
import {useControlledContext} from './ControlledContext';

export type PropsType<ItemType, ValueType> =
  ItemFieldCellRendererPropsType<ItemType, ValueType> &
  React.ComponentProps<'td'>;

function DefaultItemFieldCellRenderer<ItemType, ValueType> (
    {field, item, ...etc}: PropsType<ItemType, ValueType>
): JSX.Element {
  const {itemModel} = useControlledContext<ItemType>();
  return <td {...etc}>
    <ItemFieldValue field={field} item={item} itemModel={itemModel} />
  </td>;
}

export default React.memo(DefaultItemFieldCellRenderer);
