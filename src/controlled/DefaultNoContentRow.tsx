import React from 'react';

import {useControlledContext} from './ControlledContext';

const DefaultNoContentRow = () => {
  const {visibleFields} = useControlledContext();
  return <tr>
    <td colSpan={visibleFields.length}>
      <em>no content on this page, select another page to display</em>
    </td>
  </tr>;
};

export default React.memo(DefaultNoContentRow);
