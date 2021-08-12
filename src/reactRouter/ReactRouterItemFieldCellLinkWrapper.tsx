/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import React from 'react';
import {Link} from 'react-router-dom';

import ItemFieldCellLinkWrapperProps from '../controlled/ItemFieldCellLinkWrapperProps';

const FAKE_HOST = 'somenonexistentfakehost.temp';
const FAKE_URL_BASE = `https://${FAKE_HOST}/`;

function ReactRouterItemFieldCellLinkWrapper<T, V, F> ({
  children,
  hyperlink,
}: ItemFieldCellLinkWrapperProps<T, V, F>): JSX.Element {
  const url = new URL(hyperlink, FAKE_URL_BASE);
  if (url.host !== FAKE_HOST) {
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

  return <Link css={css(`
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
`)} to={hyperlink}>{children}</Link>;
}

export default React.memo(ReactRouterItemFieldCellLinkWrapper) as typeof ReactRouterItemFieldCellLinkWrapper;
