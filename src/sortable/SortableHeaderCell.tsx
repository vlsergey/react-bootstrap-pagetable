/** @jsx jsx */
import {css, jsx} from '@emotion/react';
import FetchArgs, {Direction, SortBy} from '../FetchArgs';
import React, {PureComponent, ReactNode} from 'react';
import FieldModel from '../FieldModel';

export interface PropsType<I, V> {
  fetchArgs: FetchArgs;
  field: FieldModel<I, V>;
  onFetchArgsChange: (fetchArgs: FetchArgs) => unknown;
}

export default class SortableHeaderCell<I, V> extends PureComponent<PropsType<I, V>> {

  private handleClick = (): void => {
    const {fetchArgs} = this.props;

    const oldDirection: Direction = ((fetchArgs.sort || [] as SortBy[])
      .find(({field}) => field === this.props.field.key) || {direction: null})
      .direction;

    const newDirection = oldDirection === 'ASC' ? 'DESC' : 'ASC';

    this.props.onFetchArgsChange({
      ...fetchArgs,
      sort: [ {
        field: this.props.field.key,
        direction: newDirection,
      } ],
    });
  };

  render (): ReactNode {
    const {fetchArgs, field} = this.props;

    if (!field.sortable) {
      return <th>{field.title}</th>;
    }

    const fieldSort: SortBy = (fetchArgs.sort || [])
      .find(sortBy => sortBy.field === field.key);

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
      `)} onClick={this.handleClick}>
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

}
