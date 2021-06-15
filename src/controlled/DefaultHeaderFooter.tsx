/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import PageIndexSelector from './PageIndexSelector';
import PageSizeSelector from './PageSizeSelector';
import React from 'react';
import {useControlledContext} from './ControlledContext';
import VisibleFieldsSettings from './VisibleFieldsSettings';

const DefaultHeaderFooter = (): JSX.Element => {
  const {disableVisibleFieldsChange} = useControlledContext();

  return <div css={css('display: flex; flex-wrap: wrap; justify-content: space-between')}>
    {!disableVisibleFieldsChange && <div>
      <VisibleFieldsSettings />
    </div>}
    <div>
      <PageIndexSelector />
    </div>
    <div>
      <PageSizeSelector />
    </div>
  </div>;
};

export default React.memo(DefaultHeaderFooter);
