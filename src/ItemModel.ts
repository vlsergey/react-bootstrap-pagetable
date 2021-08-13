import FieldModel from './FieldModel';

interface ItemModel<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fields: FieldModel<T, any, any>[];
  idF: (item: T) => string;
}

export default ItemModel;
