/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import React from 'react';

import ItemFieldCellLinkWrapperProps from './ItemFieldCellLinkWrapperProps';

function DefaultItemFieldCellLinkWrapper<T, V> ({
  children,
  hyperlink,
}: ItemFieldCellLinkWrapperProps<T, V>): JSX.Element {
  return <a css={css(`
& {
display: block;
height: 100%;
}
.table & {
margin: -0.75rem;
padding: 0.75rem;
height: calc(100% + 2 * 0.75rem);
}
.table-sm & {
margin: -0.3rem;
padding: 0.3rem;
height: calc(100% + 2 * 0.3rem);
}
`)} href={hyperlink}>{children}</a>;
}

export default React.memo(DefaultItemFieldCellLinkWrapper) as typeof DefaultItemFieldCellLinkWrapper;
