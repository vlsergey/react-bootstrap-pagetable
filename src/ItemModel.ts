import FieldModel from './FieldModel';

interface ItemModel<T> {
  fields: FieldModel<T, unknown, unknown>[];
  idF: (item: T) => string;
}

export default ItemModel;
