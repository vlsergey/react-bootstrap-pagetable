/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import React, {useCallback} from 'react';

import {useControlledContext} from '../controlled/ControlledContext';
import DefaultColumnHeaderCell from '../controlled/DefaultColumnHeaderCell';
import {Direction, SortBy} from '../FetchArgs';
import FieldModel from '../FieldModel';

export interface PropsType<I, V, F> {
  field: FieldModel<I, V, F>;
}

function SortableHeaderCell<I, V, F> ({field}: PropsType<I, V, F>): JSX.Element {
  const {fetchArgs, onFetchArgsChange} = useControlledContext<I>();

  const handleClick = useCallback(() => {
    const oldDirection: Direction | undefined = ((fetchArgs.sort || [] as SortBy[])
      .find((sortBy: SortBy) => sortBy.field === field.key) || {direction: undefined})
      .direction;

    const newDirection = oldDirection === 'ASC' ? 'DESC' : 'ASC';

    onFetchArgsChange({
      ...fetchArgs,
      sort: [{field: field.key, direction: newDirection}],
    });
  }, [fetchArgs, field.key, onFetchArgsChange]);

  if (!field.sortable) {
    return <DefaultColumnHeaderCell<I, V, F> field={field} />;
  }

  const fieldSort = (fetchArgs.sort || [])
    .find((sortBy: SortBy) => sortBy.field === field.key);

  let iconClassName = 'fas fa-sort';
  if (fieldSort !== undefined) {
    iconClassName = fieldSort.direction === 'DESC'
      ? 'fas fa-sort-up'
      : 'fas fa-sort-down';
  }

  const headerCellContent = field.headerCellContent as (undefined | React.FC<PropsType<I, V, F>>);

  return <th
    {...field.headerCellProps}
    css={css(`
      cursor : pointer;
      &:hover .fas {
        color: unset;
      }
    `)} onClick={handleClick}>
    <div css={css(`
        display: flex;
        justify-content: space-between;
      `)}>
      <div>{
        headerCellContent
          ? React.createElement(headerCellContent, {field})
          : field.title
      }</div>
      <i className={iconClassName} css={css(`
        color: lightgray;
        line-height: unset;
        margin-left: 0.25em;
      `)} />
    </div>
  </th>;
}

export default React.memo(SortableHeaderCell);
