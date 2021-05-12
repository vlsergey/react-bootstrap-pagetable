import React, { PureComponent, ReactNode } from 'react';
import FetchArgs from '../FetchArgs';
import FieldModel from '../FieldModel';
import ItemModel from '../ItemModel';
import SortableHeaderCell from './SortableHeaderCell';

interface RequiredBaseComponentProps {
  columnHeaderCell?: ( field : FieldModel<unknown> ) => ReactNode;
  fetchArgs: FetchArgs;
  itemModel: ItemModel<unknown>;
  onFetchArgsChange: ( fetchArgs : FetchArgs ) => unknown;
}

const withSortable = <P extends RequiredBaseComponentProps>( Child : React.ComponentType<P> ) :
React.ComponentType<Omit<P, 'columnHeaderCell'>> =>
    class WithSortable extends PureComponent<Omit<P, 'columnHeaderCell'>> {

    renderColumnHeaderCell = <V extends unknown>( field : FieldModel<V> ) : ReactNode =>
      <SortableHeaderCell
        fetchArgs={this.props.fetchArgs}
        field={field}
        key={field.key}
        onFetchArgsChange={this.props.onFetchArgsChange} />;

    render() : ReactNode {
      const { fetchArgs, itemModel, onFetchArgsChange, ...etcProps } = this.props;

      const tableSortable = itemModel.fields.some( ( { sortable } ) => sortable );

      if ( !tableSortable ) {
        return <Child
          {...etcProps as P}
          fetchArgs={fetchArgs}
          itemModel={itemModel}
          onFetchArgsChange={onFetchArgsChange} />;
      }

      return <Child
        {...etcProps as P}
        columnHeaderCell={this.renderColumnHeaderCell}
        fetchArgs={fetchArgs}
        itemModel={itemModel}
        onFetchArgsChange={onFetchArgsChange} />;
    }

    };

export default withSortable;
