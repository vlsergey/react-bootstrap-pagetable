import * as ContolledPageTableSpace from './ContolledPageTable';
import React, { PureComponent, ReactNode } from 'react';
import ContolledPageTable from './ContolledPageTable';
import FieldModel from './FieldModel';
import ItemModel from './ItemModel';
import memoizeOne from 'memoize-one';

export type PropsType<T> = ContolledPageTableSpace.PropsType<T> & {
  selectable : boolean;
}

type StateType = {
  selectedIds: string[],
}

const renderCheckboxField = ( selected : boolean ) : ReactNode =>
  <input checked={selected} readOnly type="checkbox" />;

// const CHECKBOX_CELL_PROPS = { style: { textAlign: 'center' } };

export default class WithSelectablePageTable<T>
  extends PureComponent<PropsType<T>, StateType> {

  static defaultProps = {
    selectable: true,
  }

  state = {
    selectedIds: [] as string[],
  };

  getSelectedSet : ( ( selectedIds : string[] ) => Set<string> ) =
    memoizeOne( ( selectedIds : string[] ) => new Set( selectedIds ) ) ;

  private handleTrigger( item : T ) {
    const itemKey : string = this.props.itemModel.idF( item );
    this.setState( ( { selectedIds } : StateType<T> ) => {
      const index = selectedIds.indexOf( itemKey );
      if ( index === -1 ) {
        return { selectedIds: [ ...selectedIds, itemKey ] };
      }

      const spliced = [ ...selectedIds ];
      spliced.splice( index, 1 );
      return { selectedIds: spliced };
    } );
  }

  private rowProps : ( ( item : T ) => Record<string, unknown> ) = ( item : T ) => ( {
    onClick: () => this.handleTrigger( item ),
    style: { cursor: 'pointer' },
  } );

  selectableFieldGetter = ( item: T ) : boolean =>
    this.getSelectedSet( this.state.selectedIds ).has( this.props.itemModel.idF( item ) );

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
