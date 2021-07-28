/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import React from 'react';

import ItemFieldCellLinkWrapperProps from './ItemFieldCellLinkWrapperProps';

function DefaultItemFieldCellLinkWrapper ({
  children,
  hyperlink,
}: ItemFieldCellLinkWrapperProps<unknown, unknown>): JSX.Element {
  return <a css={css(`
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

export default React.memo(DefaultItemFieldCellLinkWrapper);
