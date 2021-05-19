import FieldModel from './FieldModel';

interface ItemModel<T> {
  fields: FieldModel<T, unknown>[];
  idF: (item: T) => string;
}

export default ItemModel;
