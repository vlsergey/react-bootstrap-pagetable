import React from 'react';

import FieldModel, {defaultGetter, defaultRender, ValueRendererProps} from './FieldModel';
import ItemModel from './ItemModel';

interface PropsType<I, V, F> {
  itemModel: ItemModel<I>;
  item: I;
  field: FieldModel<I, V, F>;
}

const ItemFieldValue =
  <I, V, F>({itemModel, item, field}: PropsType<I, V, F>): JSX.Element => {
    const value: V = (field.getter || defaultGetter)(item, field, itemModel);
    const Renderer = (field.render || defaultRender) as unknown as
    React.FunctionComponent<ValueRendererProps<I, V>>;
    return React.createElement(Renderer, {item, value});
  };

export default ItemFieldValue;
