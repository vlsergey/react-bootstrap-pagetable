import React, {useCallback, useState} from 'react';

import {DEFAULT_FOOTER_HEADER_ELEMENTS} from '../controlled/';
import ControlledPropsType from '../controlled/ControlledPropsType';
import {NewComponentProps as SelectablePropsType} from '../selectable/withSelectable';
import Action from './Action';
import ActionsContext, {ActionsContextType} from './ActionsContext';
import ActionsToolbar from './ActionsToolbar';

export type RequiredChildComponentProps<T> =
  Pick<SelectablePropsType, 'onSelectedIdsChange' | 'selectable' | 'selectedIds'> &
  Pick<ControlledPropsType<T>, 'footerElements' | 'headerElements' | 'itemModel' | 'page' | 'size'>;

export interface NewComponentProps<T> {
  actions?: Action<T>[];
  buttonProps?: (action: Action<T>, selectedItems: T[]) => Record<string, unknown>;
  toolbarProps?: Record<string, unknown>;
  onAfterAction?: (action: Action<T>, items: T[]) => unknown;
  onRefreshRequired?: () => unknown;
  onSelectedIdsChange?: SelectablePropsType['onSelectedIdsChange'];
}

export type PropsType<T, P extends RequiredChildComponentProps<T>> =
  NewComponentProps<T> & Omit<P, 'onSelectedIdsChange' | 'selectedIds'>;

const withActions = <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>) =>
  function WithActions ({
    actions,
    buttonProps,
    footerElements = [
      ...DEFAULT_FOOTER_HEADER_ELEMENTS,
      [[ActionsToolbar]],
    ],
    onAfterAction,
    onRefreshRequired,
    onSelectedIdsChange,
    selectable,
    ...etcProps
  }: PropsType<T, P>): JSX.Element {

    const [selectedIds, setSelectedIds] = useState([] as string[]);

    const handleSelectedIdsChange = useCallback((selectedIds: string[]) => {
      setSelectedIds(selectedIds);
      if (onSelectedIdsChange) {
        onSelectedIdsChange(selectedIds);
      }
    }, [onSelectedIdsChange, setSelectedIds]);

    return <ActionsContext.Provider value={{
      actions,
      buttonProps,
      onAfterAction,
      onRefreshRequired,
      selectedIds,
    } as unknown as ActionsContextType<unknown>}>
      <Child
        {...etcProps as unknown as P}
        footerElements={footerElements}
        onSelectedIdsChange={handleSelectedIdsChange}
        selectable={selectable || !!actions}
        selectedIds={selectedIds} />
    </ActionsContext.Provider>;
  };

export default withActions;
