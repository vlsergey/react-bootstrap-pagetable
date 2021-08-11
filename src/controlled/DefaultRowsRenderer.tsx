/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import React from 'react';

import FieldModel from '../FieldModel';
import {useControlledContext} from './ControlledContext';
import useVisibleFields from './visibleFields/useVisibleFields';

function DefaultRowsRenderer<T> (): JSX.Element {
  const {itemFieldCellRenderer, itemModel, page, rowProps} = useControlledContext<T>();
  const visibleFields: FieldModel<T, unknown>[] = useVisibleFields<T>();

  type IdFunction<T> = (item: T) => string;
  const item2id: IdFunction<T> = itemModel.idF;
  const ItemFieldCellRenderer = itemFieldCellRenderer;

  return page.content.map((item: T) => <tr css={css('height: 1px;')} key={item2id(item)} {...(rowProps ? rowProps(item) : {})}>
    { visibleFields.map((field: FieldModel<T, unknown>) =>
      <ItemFieldCellRenderer field={field} item={item} key={field.key} />
    ) }
  </tr>) as unknown as JSX.Element;
}

export default React.memo(DefaultRowsRenderer);
