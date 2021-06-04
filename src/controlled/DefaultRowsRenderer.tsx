import FieldModel from '../FieldModel';
import {PropsType as ItemFieldCellRendererProps} from './DefaultItemFieldCellRenderer';
import ItemModel from '../ItemModel';
import React from 'react';

export interface PropsType<T> {
  fieldsToRender: FieldModel<T, unknown>[];
  itemFieldCellRenderer: (props: ItemFieldCellRendererProps<T, unknown>) => JSX.Element;
  itemModel: ItemModel<T>;
  items: T[];
  rowProps?: (item: T) => React.ComponentProps<'tr'>;
}

function DefaultRowsRenderer<T> (
    {fieldsToRender, itemFieldCellRenderer, items, itemModel, rowProps}: PropsType<T>
): JSX.Element {
  type IdFunction<T> = (item: T) => string;
  const item2id: IdFunction<T> = itemModel.idF;
  const ItemFieldCellRenderer = itemFieldCellRenderer;

  return items.map((item: T) => <tr key={item2id(item)} {...(rowProps ? rowProps(item) : {})}>
    { fieldsToRender.map((field: FieldModel<T, unknown>) =>
      <ItemFieldCellRenderer field={field} item={item} itemModel={itemModel} key={field.key} />
    ) }
  </tr>) as unknown as JSX.Element;
}

const MemoizedDefaultRowsRenderer = React.memo(DefaultRowsRenderer);
export default MemoizedDefaultRowsRenderer;
