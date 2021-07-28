/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import React from 'react';
import {Link} from 'react-router-dom';

import ItemFieldCellLinkWrapperProps from '../controlled/ItemFieldCellLinkWrapperProps';

const FAKE_HOST = 'somenonexistentfakehost.temp';
const FAKE_URL_BASE = `https://${FAKE_HOST}/`;

function ReactRouterItemFieldCellLinkWrapper ({
  children,
  hyperlink,
}: ItemFieldCellLinkWrapperProps<unknown, unknown>): JSX.Element {
  const url = new URL(hyperlink, FAKE_URL_BASE);
  if (url.host !== FAKE_HOST) {
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

  return <Link css={css(`
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
`)} to={hyperlink}>{children}</Link>;
}

export default React.memo(ReactRouterItemFieldCellLinkWrapper);
