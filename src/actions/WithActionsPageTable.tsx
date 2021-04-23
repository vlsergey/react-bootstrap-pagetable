import React, { PureComponent, ReactNode } from 'react';
import WithSelectablePageTable, * as WithSelectablePageTableSpace from '../WithSelectablePageTable';
import Action from './Action';
import ItemModel from '../ItemModel';
import Toolbar from './Toolbar';

export interface PropsType<T> extends WithSelectablePageTableSpace.PropsType<T> {
  actions?: Action<T>[];
  buttonProps?: ( action : Action<T>, selectedItems : T[] ) => Record<string, unknown>;
  toolbarProps?: Record<string, unknown>;
  onAfterAction? : ( action : Action<T>, items : T[] ) => unknown;
  onRefreshRequired : () => unknown;
}

export type StateType = {
  selectedIds : string[],
}

function filterItemsByIdsImpl<T>(
    itemModel : ItemModel<T>,
    items : T[],
    ids : string[] ) : T[] {
  const item2Id : ( item : T ) => string = itemModel.idF;
  const idsSet : Set< string > = new Set( ids );
  return items.filter( item => idsSet.has( item2Id( item ) ) );
}

export default class WithActionsPageTable<T> extends PureComponent<PropsType<T>, StateType> {

  state = {
    selectedIds: [] as string[],
  }

  private handleAfterAction = async( action : Action<T> ) => {
    if ( action.refreshAfterAction ) {
      await this.props.onRefreshRequired();
    }
  }

  private handleSelectedIdsChange = ( selectedIds: string[] ) => {
    this.setState( { selectedIds } );
  }

  render() : ReactNode {
    const { actions, itemModel, page, selectable, ...etcProps } = this.props;
    const { selectedIds } = this.state;

    if ( !actions || actions.length === 0 ) {
      return <WithSelectablePageTable
        {...etcProps}
        itemModel={itemModel}
        onSelectedIdsChange={this.handleSelectedIdsChange}
        page={page}
        selectable={selectable}
        selectedIds={selectedIds} />;
    }

    return <>
      <WithSelectablePageTable
        {...etcProps}
        itemModel={itemModel}
        onSelectedIdsChange={this.handleSelectedIdsChange}
        page={page}
        selectable
        selectedIds={selectedIds} />
      <Toolbar
        actions={actions}
        selectedItems={filterItemsByIdsImpl( itemModel, page.content, selectedIds )} />
    </>;
  }

}
