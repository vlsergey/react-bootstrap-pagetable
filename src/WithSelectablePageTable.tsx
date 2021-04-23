import React, { PureComponent, ReactNode } from 'react';
import ContolledPageTable, * as ContolledPageTableSpace from './ContolledPageTable';
import FieldModel from './FieldModel';
import ItemModel from './ItemModel';
import memoizeOne from 'memoize-one';

export type PropsType<T> = ContolledPageTableSpace.PropsType<T> & {
  selectable? : boolean;
  onSelectedIdsChange: ( selectedIds: string[] ) => unknown,
  selectedIds: string[],
}

const renderCheckboxField = ( selected : boolean ) : ReactNode =>
  <input checked={selected} readOnly type="checkbox" />;

// const CHECKBOX_CELL_PROPS = { style: { textAlign: 'center' } };

export default class WithSelectablePageTable<T>
  extends PureComponent<PropsType<T>> {

  static defaultProps = {
    selectable: false,
  }

  getSelectedSet : ( ( selectedIds : string[] ) => Set<string> ) =
    memoizeOne( ( selectedIds : string[] ) => new Set( selectedIds ) ) ;

  private handleTrigger( item : T ) : unknown {
    const itemKey : string = this.props.itemModel.idF( item );
    const { onSelectedIdsChange, selectedIds } = this.props;

    const index = selectedIds.indexOf( itemKey );
    if ( index === -1 ) {
      const newSelectedIds : string[] = [ ...selectedIds, itemKey ];
      return onSelectedIdsChange( newSelectedIds );
    }

    const spliced = [ ...selectedIds ];
    spliced.splice( index, 1 );
    return onSelectedIdsChange( spliced );
  }

  private rowProps : ( ( item : T ) => Record<string, unknown> ) = ( item : T ) => ( {
    onClick: () => this.handleTrigger( item ),
    style: { cursor: 'pointer' },
  } );

  selectableFieldGetter = ( item: T ) : boolean =>
    this.getSelectedSet( this.props.selectedIds ).has( this.props.itemModel.idF( item ) );

  render() : ReactNode {
    const { itemModel, selectable, ...etcProps } = this.props;

    if ( !selectable ) {
      return <ContolledPageTable itemModel={itemModel} {...etcProps} />;
    }

    const newItemModel : ItemModel<T> = {
      ...itemModel,
      fields: [
        {
          key: '$selectable',
          getter: this.selectableFieldGetter,
          render: renderCheckboxField,
          title: <div />,
        } as FieldModel<boolean>,
        ...itemModel.fields,
      ]
    };

    return <ContolledPageTable
      {...etcProps}
      itemModel={newItemModel}
      rowProps={this.rowProps} />;
  }

}
