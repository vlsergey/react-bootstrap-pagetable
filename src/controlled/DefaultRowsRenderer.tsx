import FieldModel from '../FieldModel';
import React from 'react';
import {useControlledContext} from './ControlledContext';
import useVisibleFields from './useVisibleFields';

function DefaultRowsRenderer<T> (): JSX.Element {
  const {itemFieldCellRenderer, itemModel, page, rowProps} = useControlledContext();
  const visibleFields: FieldModel<T, unknown>[] = useVisibleFields<T>();

  type IdFunction<T> = (item: T) => string;
  const item2id: IdFunction<T> = itemModel.idF;
  const ItemFieldCellRenderer = itemFieldCellRenderer;

  return page.content.map((item: T) => <tr key={item2id(item)} {...(rowProps ? rowProps(item) : {})}>
    { visibleFields.map((field: FieldModel<T, unknown>) =>
      <ItemFieldCellRenderer field={field} item={item} key={field.key} />
    ) }
  </tr>) as unknown as JSX.Element;
}

export default React.memo(DefaultRowsRenderer);
