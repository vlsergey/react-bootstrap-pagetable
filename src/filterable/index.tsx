import InnerPageTable, * as InnerPageTableSpace from '../actions';
import React, { PureComponent, ReactNode } from 'react';
import FieldModel from '../FieldModel';

export type PropsType<T> = Omit<InnerPageTableSpace.PropsType<T>, 'columnHeaderRow'>;

export default class WithFilterablePageTable<T> extends PureComponent<PropsType<T>> {

  private renderColumnHeaderRow = ( fieldsToRender : FieldModel<unknown>[] ) : ReactNode => {
    const { fetchArgs, onFetchArgsChange } = this.props;
    return <>
      <tr>{fieldsToRender.map( this.props.columnHeaderCell )}</tr>
      <tr>
        {fieldsToRender.map( ( field : FieldModel<unknown> ) =>
          field.renderFilterCell
            ? field.renderFilterCell(
              ( fetchArgs.filter || {} )[ field.key ] || null,
              ( newFilterBy : string ) => onFetchArgsChange( {
                ...fetchArgs,
                filter: {
                  ...fetchArgs.filter,
                  [ field.key ]: newFilterBy,
                }
              } ),
              field )
            : <td />
        )}
      </tr>
    </>;
  }

  render() : ReactNode {
    const { fetchArgs, itemModel, onFetchArgsChange, ...etcProps } = this.props;

    const tableFilterable = itemModel.fields.some( ( { renderFilterCell } ) => !!renderFilterCell );

    if ( !tableFilterable ) {
      return <InnerPageTable
        {...etcProps}
        fetchArgs={fetchArgs}
        itemModel={itemModel}
        onFetchArgsChange={onFetchArgsChange} />;
    }

    return <InnerPageTable
      {...etcProps}
      columnHeaderRow={this.renderColumnHeaderRow}
      fetchArgs={fetchArgs}
      itemModel={itemModel}
      onFetchArgsChange={onFetchArgsChange} />;
  }

}
