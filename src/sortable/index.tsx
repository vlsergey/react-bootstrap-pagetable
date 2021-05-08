import InnerPageTable, * as InnerPageTableSpace from '../filterable';
import React, { PureComponent, ReactNode } from 'react';
import FieldModel from '../FieldModel';
import SortableHeaderCell from './SortableHeaderCell';

export type PropsType<T> = Omit<InnerPageTableSpace.PropsType<T>, 'columnHeaderCell'>;

export default class WithSortablePageTable<T>
  extends PureComponent<PropsType<T>> {

  private renderColumnHeaderCell = <V extends unknown>( field : FieldModel<V> ) : ReactNode =>
    <SortableHeaderCell
      fetchArgs={this.props.fetchArgs}
      field={field}
      key={field.key}
      onFetchArgsChange={this.props.onFetchArgsChange} />;

  render() : ReactNode {
    const { fetchArgs, itemModel, onFetchArgsChange, ...etcProps } = this.props;

    const tableSortable = itemModel.fields.some( ( { sortable } ) => sortable );

    if ( !tableSortable ) {
      return <InnerPageTable
        {...etcProps}
        fetchArgs={fetchArgs}
        itemModel={itemModel}
        onFetchArgsChange={onFetchArgsChange} />;
    }

    return <InnerPageTable
      {...etcProps}
      columnHeaderCell={this.renderColumnHeaderCell}
      fetchArgs={fetchArgs}
      itemModel={itemModel}
      onFetchArgsChange={onFetchArgsChange} />;
  }

}
