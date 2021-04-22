import FieldModel from './FieldModel';

interface ItemModel<T> {
  fields: FieldModel<unknown>[];
  idF: ( item : T ) => string;
}

export default ItemModel;
