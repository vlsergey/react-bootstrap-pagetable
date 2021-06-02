import FieldModel from './FieldModel';
import ItemFieldValue from './ItemFieldValue';
import ItemModel from './ItemModel';
import React from 'react';

export interface PropsType<T> {
  fieldsToRender: FieldModel<T, unknown>[];
  itemModel: ItemModel<T>;
  items: T[];
  rowProps?: (item: T) => React.ComponentProps<'tr'>;
}

function DefaultRowsRenderer<T> ({fieldsToRender, items, itemModel, rowProps}: PropsType<T>): JSX.Element {
  type IdFunction<T> = (item: T) => string;
  const item2id: IdFunction<T> = itemModel.idF;

  return items.map((item: T) => <tr key={item2id(item)} {...(rowProps ? rowProps(item) : {})}>
    { fieldsToRender.map((field: FieldModel<T, unknown>) =>
      <td key={field.key}>
        <ItemFieldValue field={field} item={item} itemModel={itemModel} />
      </td>
    ) }
  </tr>) as unknown as JSX.Element;
}

const MemoizedDefaultRow = React.memo(DefaultRowsRenderer);
export default MemoizedDefaultRow;
