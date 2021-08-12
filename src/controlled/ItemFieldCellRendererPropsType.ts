import FieldModel from '../FieldModel';

interface ItemFieldCellRendererPropsType<I, V, F> {
  field: FieldModel<I, V, F>;
  item: I;
}

export default ItemFieldCellRendererPropsType;
