import FieldModel from '../FieldModel';

interface ItemFieldCellRendererPropsType<ItemType, ValueType> {
  field: FieldModel<ItemType, ValueType>;
  item: ItemType;
}

export default ItemFieldCellRendererPropsType;
