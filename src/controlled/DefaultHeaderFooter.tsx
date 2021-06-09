/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import React, {useCallback} from 'react';
import HeaderFooterPropsType from './HeaderFooterPropsType';
import PageSizeSelector from './PageSizeSelector';
import Pagination from '@vlsergey/react-bootstrap-pagination';

function DefaultHeaderFooter<T> (
    {fetchArgs, onFetchArgsChange, page, size}: HeaderFooterPropsType<T>
): JSX.Element {

  const handleSizeChange = useCallback((value: number) =>
    onFetchArgsChange({...fetchArgs, size: value}), [ onFetchArgsChange ]);

  const handlePageChange = useCallback(({target: {value}}: {target: {value: number}}) =>
    onFetchArgsChange({...fetchArgs, page: value}), [ onFetchArgsChange ]);

  return <div css={css('display: flex; flex-wrap: wrap; justify-content: space-between')}>
    <div>
      <Pagination
        name="page"
        onChange={handlePageChange}
        size={size}
        totalPages={page.totalPages}
        value={fetchArgs.page} />
    </div>
    <div>
      <PageSizeSelector
        onChange={handleSizeChange}
        size={size}
        value={fetchArgs.size} />
    </div>
  </div>;

}

export default React.memo(DefaultHeaderFooter);
