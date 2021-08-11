import React, {useCallback, useMemo} from 'react';

import {useControlledContext} from '../controlled/ControlledContext';
import ItemModel from '../ItemModel';
import Action from './Action';
import {useActionsContext} from './ActionsContext';
import Toolbar from './Toolbar';

function filterItemsByIdsImpl<T> (
    itemModel: ItemModel<T>,
    items: T[],
    ids: string[]): T[] {
  const item2Id: (item: T) => string = itemModel.idF;
  const idsSet: Set< string > = new Set(ids);
  return items.filter(item => idsSet.has(item2Id(item)));
}

function ActionsToolbar<T> (): JSX.Element {
  const {actions, onAfterAction, onRefreshRequired, selectedIds} = useActionsContext<T>();
  const {itemModel, page, size} = useControlledContext<T>();

  const handleAfterAction = useCallback(async (action: Action<T>, items: T[]): Promise<void> => {
    if (onAfterAction) {
      await onAfterAction(action, items);
    }

    if (action.refreshAfterAction && onRefreshRequired) {
      await onRefreshRequired();
    }
  }, [onAfterAction, onRefreshRequired]);

  const selectedItems: T[] = useMemo(() =>
    filterItemsByIdsImpl<T>(itemModel, page.content, selectedIds)
  , [itemModel, page.content, selectedIds]);

  if (!actions) {
    return null as unknown as JSX.Element;
  }

  return <Toolbar<T>
    actions={actions}
    onAfterAction={handleAfterAction}
    selectedItems={selectedItems}
    size={size} />;
}

export default React.memo(ActionsToolbar);
