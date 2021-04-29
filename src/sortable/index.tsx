import InnerPageTable, * as InnerPageTableSpace from '../actions';
import React, { PureComponent, ReactNode } from 'react';
import FieldModel from '../FieldModel';
import SortableHeaderCell from './SortableHeaderCell';

export type PropsType<T> = Omit<InnerPageTableSpace.PropsType<T>, 'headerCell'>;

export default class WithSortablePageTable<T>
  extends PureComponent<PropsType<T>> {

  private renderHeaderCell = <V extends unknown>( field : FieldModel<V> ) : ReactNode =>
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
      fetchArgs={fetchArgs}
      headerCell={this.renderHeaderCell}
      itemModel={itemModel}
      onFetchArgsChange={onFetchArgsChange} />;
  }

}
