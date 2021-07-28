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
  const {itemModel, itemFieldCellHyperlink} = useControlledContext<ItemType>();

  const hyperlink: string = useMemo(() =>
    itemFieldCellHyperlink(item, field)
  , [itemFieldCellHyperlink, item, field]);

  let children = <ItemFieldValue field={field} item={item} itemModel={itemModel} />;

  if (hyperlink) {
    children = <a css={css(`
& {
  display: block;
}
.table & {
  margin: -0.75rem;
  padding: 0.75rem;
}
.table-sm & {
  margin: -0.3rem;
  padding: 0.3rem;
}
.table-lg & {
  margin: -0.75rem;
  padding: 0.75rem;
}
`)} href={hyperlink}>{children}</a>;
  }

  return <td {...etc}>
    {children}
  </td>;
}

export default React.memo(DefaultItemFieldCellRenderer);
