import FieldModel, {defaultGetter, defaultRender, ValueRendererProps} from './FieldModel';
import ItemModel from './ItemModel';
import React from 'react';

interface PropsType<ItemType, ValueType> {
  itemModel: ItemModel<ItemType>;
  item: ItemType;
  field: FieldModel<ItemType, ValueType>;
}

const ItemFieldValue =
  <ItemType, ValueType>({itemModel, item, field}: PropsType<ItemType, ValueType>): JSX.Element => {
    const value: ValueType = (field.getter || defaultGetter)(item, field, itemModel);
    const Renderer = (field.render || defaultRender) as unknown as
    React.FunctionComponent<ValueRendererProps<ItemType, ValueType>>;
    return React.createElement(Renderer, {item, value});
  };

export default ItemFieldValue;
