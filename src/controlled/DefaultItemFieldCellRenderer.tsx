/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import React, {useMemo} from 'react';

import ItemFieldValue from '../ItemFieldValue';
import {useControlledContext} from './ControlledContext';
import ItemFieldCellRendererPropsType from './ItemFieldCellRendererPropsType';

export type PropsType<I, V, F> =
  ItemFieldCellRendererPropsType<I, V, F> &
  React.ComponentProps<'td'>;

function DefaultItemFieldCellRenderer<I, V, F> (
    {field, item, ...etc}: PropsType<I, V, F>
): JSX.Element {
  const {itemModel, itemFieldCellHyperlink, itemFieldCellLinkWrapper} =
    useControlledContext<I>();

  const hyperlink = useMemo(() =>
    itemFieldCellHyperlink(item, field)
  , [itemFieldCellHyperlink, item, field]);

  let children = <ItemFieldValue field={field} item={item} itemModel={itemModel} />;

  if (hyperlink) {
    children = React.createElement(itemFieldCellLinkWrapper as
        (props: ItemFieldCellRendererPropsType<I, V, F>) => JSX.Element, {
      field, hyperlink, item
    }, children);
  }

  return <td css={css('height: inherit;')} {...etc}>
    {children}
  </td>;
}

export default React.memo(DefaultItemFieldCellRenderer) as typeof DefaultItemFieldCellRenderer;
