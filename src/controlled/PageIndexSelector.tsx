import React, {useCallback} from 'react';
import Pagination from '@vlsergey/react-bootstrap-pagination';
import {useControlledContext} from './ControlledContext';

const PageIndexSelector = () => {
  const {fetchArgs, onFetchArgsChange, page, size} = useControlledContext();

  const handlePageChange = useCallback(({target: {value}}: {target: {value: number}}) =>
    onFetchArgsChange({...fetchArgs, page: value}), [ fetchArgs, onFetchArgsChange ]);

  return <Pagination
    onChange={handlePageChange}
    size={size}
    style={{margin: 0}}
    totalPages={page.totalPages}
    value={fetchArgs.page} />;
};

export default React.memo(PageIndexSelector);
