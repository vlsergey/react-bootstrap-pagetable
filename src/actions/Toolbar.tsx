import React, {useCallback} from 'react';
import {ButtonProps} from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

import Action from './Action';
import ActionButton from './ActionButton';

interface PropsType<T> {
  actions?: Action<T>[];
  buttonProps?: (action: Action<T>, selectedItems: T[]) => Record<string, unknown>;
  toolbarProps?: Record<string, unknown>;
  onAfterAction: (action: Action<T>, items: T[]) => unknown;
  selectedItems: T[];
  size?: ButtonProps['size'];
}

// const EMPTY_ACTIONS = [] as Action<unknown>[];
const EMPTY_PROPS = {} as Record<string, unknown>;

function Toolbar<T> ({
  actions = [],
  buttonProps = (): Record<string, unknown> => EMPTY_PROPS,
  toolbarProps = EMPTY_PROPS,
  onAfterAction = (): void => { /* NOOP */ },
  selectedItems,
  size,
}: PropsType<T>) {

  const handleAction = useCallback(async (action: Action<T>, ...etc: unknown[]): Promise< unknown > => {
    try {
      return await action.onAction(selectedItems, ...etc);
    } finally {
      if (onAfterAction) {
        await onAfterAction(action, selectedItems);
      }
    }
  }, [onAfterAction, selectedItems]);

  const buttons = actions
    .filter(({visible}: Action<T>) => !visible || visible(selectedItems))
    .map((action: Action<T>) => <ActionButton<T>
      action={action}
      disabled={action.enabled && !action.enabled(selectedItems)}
      key={action.key}
      onAction={handleAction}
      size={size}
      {...(buttonProps ? buttonProps(action, selectedItems) : {})} />);
  if (!buttons.length) {
    return null;
  }

  return <ButtonToolbar {...(toolbarProps || {})}>
    {buttons}
  </ButtonToolbar>;
}

export default React.memo(Toolbar) as typeof Toolbar;
