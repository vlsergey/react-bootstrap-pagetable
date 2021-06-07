import FieldModel from '../FieldModel';
import ItemModel from '../ItemModel';

interface ItemFieldCellRendererPropsType<ItemType, ValueType> {
  field: FieldModel<ItemType, ValueType>;
  item: ItemType;
  itemModel: ItemModel<ItemType>;
}

export default ItemFieldCellRendererPropsType;
