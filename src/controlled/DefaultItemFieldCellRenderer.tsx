/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import React, {useMemo} from 'react';

import ItemFieldValue from '../ItemFieldValue';
import {useControlledContext} from './ControlledContext';
import ItemFieldCellRendererPropsType from './ItemFieldCellRendererPropsType';

export type PropsType<ItemType, ValueType> =
  ItemFieldCellRendererPropsType<ItemType, ValueType> &
  React.ComponentProps<'td'>;

function DefaultItemFieldCellRenderer<ItemType, ValueType> (
    {field, item, ...etc}: PropsType<ItemType, ValueType>
): JSX.Element {
  const {itemModel, itemFieldCellHyperlink, itemFieldCellLinkWrapper} =
    useControlledContext<ItemType>();

  const hyperlink: string = useMemo(() =>
    itemFieldCellHyperlink(item, field)
  , [itemFieldCellHyperlink, item, field]);

  let children = <ItemFieldValue field={field} item={item} itemModel={itemModel} />;

  if (hyperlink) {
    children = React.createElement(itemFieldCellLinkWrapper, {
      field, hyperlink, item
    }, children);
  }

  return <td css={css('height: inherit;')} {...etc}>
    {children}
  </td>;
}

export default React.memo(DefaultItemFieldCellRenderer);
