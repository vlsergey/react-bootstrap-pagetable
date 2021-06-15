/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import {Direction, SortBy} from '../FetchArgs';
import React, {useCallback, useContext} from 'react';
import ControlledContext from '../controlled/ControlledContext';
import FieldModel from '../FieldModel';

export interface PropsType<I, V> {
  field: FieldModel<I, V>;
}

function SortableHeaderCell<I, V> ({field}: PropsType<I, V>): JSX.Element {
  const {fetchArgs, onFetchArgsChange} = useContext(ControlledContext);

  const handleClick = useCallback(() => {
    const oldDirection: Direction = ((fetchArgs.sort || [] as SortBy[])
      .find((sortBy: SortBy) => sortBy.field === field.key) || {direction: null})
      .direction;

    const newDirection = oldDirection === 'ASC' ? 'DESC' : 'ASC';

    onFetchArgsChange({
      ...fetchArgs,
      sort: [ {field: field.key, direction: newDirection} ],
    });
  }, [ fetchArgs, field.key, onFetchArgsChange ]);

  if (!field.sortable) {
    return <th>{field.title}</th>;
  }

  const fieldSort: SortBy = (fetchArgs.sort || [])
    .find((sortBy: SortBy) => sortBy.field === field.key);

  let iconClassName = 'fas fa-sort';
  if (fieldSort !== undefined) {
    iconClassName = fieldSort.direction === 'DESC'
      ? 'fas fa-sort-up'
      : 'fas fa-sort-down';
  }

  return <th css={css(`
      cursor : pointer;
      &:hover .fas {
        color: unset;
      }
    `)} onClick={handleClick}>
    <div css={css(`
        cursor : pointer;
        display: flex;
        justify-content: space-between;
      `)}>
      <div>{field.title}</div>
      <i className={iconClassName} css={css(`
        color: lightgray;
        line-height: unset;
        margin-left: 0.25em;
      `)} />
    </div>
  </th>;
}

export default React.memo(SortableHeaderCell);
