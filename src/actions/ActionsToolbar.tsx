import React, {useMemo} from 'react';
import Action from './Action';
import ItemModel from '../ItemModel';
import Toolbar from './Toolbar';
import {useActionsContext} from './ActionsContext';
import {useControlledContext} from '../controlled/ControlledContext';

function filterItemsByIdsImpl<T> (
    itemModel: ItemModel<T>,
    items: T[],
    ids: string[]): T[] {
  const item2Id: (item: T) => string = itemModel.idF;
  const idsSet: Set< string > = new Set(ids);
  return items.filter(item => idsSet.has(item2Id(item)));
}

function ActionsToolbar<T> (): JSX.Element {
  const {actions, onAfterAction, onRefreshRequired, selectedIds} = useActionsContext();
  const {itemModel, page, size} = useControlledContext();

  const handleAfterAction = useMemo(() => async (action: Action<T>, items: T[]) => {
    if (onAfterAction) {
      await onAfterAction(action, items);
    }

    if (action.refreshAfterAction && onRefreshRequired) {
      await onRefreshRequired();
    }
  }, [ onAfterAction, onRefreshRequired ]);

  if (!actions) {
    return null;
  }

  return <Toolbar
    actions={actions}
    onAfterAction={handleAfterAction}
    selectedItems={filterItemsByIdsImpl(itemModel, page.content, selectedIds)}
    size={size} />;
}

export default React.memo(ActionsToolbar);
