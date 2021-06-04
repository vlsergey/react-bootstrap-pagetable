import FieldModel from '../FieldModel';
import ItemFieldValue from '../ItemFieldValue';
import ItemModel from '../ItemModel';
import React from 'react';

export interface PropsType<ItemType, ValueType> {
  field: FieldModel<ItemType, ValueType>;
  item: ItemType;
  itemModel: ItemModel<ItemType>;
}

function DefaultItemFieldCellRenderer<ItemType, ValueType> (
    {field, item, itemModel}: PropsType<ItemType, ValueType>
): JSX.Element {
  return <td key={field.key}>
    <ItemFieldValue field={field} item={item} itemModel={itemModel} />
  </td>;
}

const DefaultItemFieldCellRendererMemoized = React.memo(DefaultItemFieldCellRenderer);
export default DefaultItemFieldCellRendererMemoized;
