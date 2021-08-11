import React, {useContext} from 'react';

import {NewComponentProps} from './withActions';

export interface ActionsContextType<T> {
  actions?: NewComponentProps<T>['actions'];
  buttonProps?: NewComponentProps<T>['buttonProps'];
  onAfterAction?: NewComponentProps<T>['onAfterAction'];
  onRefreshRequired?: NewComponentProps<T>['onRefreshRequired'];
  selectedIds: string[];
}

const ActionsContext = React.createContext<ActionsContextType<unknown>>(
  null as unknown as ActionsContextType<unknown>);
export default ActionsContext;

export function useActionsContext<T> (): ActionsContextType<T> {
  return useContext(ActionsContext) as unknown as ActionsContextType<T>;
}
