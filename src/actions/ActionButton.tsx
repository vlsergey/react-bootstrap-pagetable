import Button from '@vlsergey/react-bootstrap-button-with-spinner';
import React, {useCallback} from 'react';
import {ButtonProps} from 'react-bootstrap/Button';

import Action from './Action';

export interface PropsType<T> {
  action: Action<T>;
  disabled: boolean;
  onAction: (action: Action<T>, ...etc: unknown[]) => unknown;
  selectedItems: T[];
  size: ButtonProps['size'];
}

function ActionButton<T> ({
  action,
  disabled,
  onAction,
  selectedItems,
  size,
  ...etcProps
}: PropsType<T>) {

  const handleClick = useCallback((...etc: unknown[]) => onAction(action, ...etc), [action, onAction]);

  if (action.buttonComponent) {
    const ActionButtonComponent = action.buttonComponent;
    return <ActionButtonComponent
      disabled={disabled}
      onClick={handleClick}
      selectedItems={selectedItems}
      size={size}
      variant={action.variant}
      {...etcProps}>
      {action.title}
    </ActionButtonComponent>;
  }

  return <Button
    className={'mr-2'}
    disabled={disabled}
    onClick={handleClick}
    size={size}
    variant={action.variant}
    {...etcProps}>
    {action.title}
  </Button>;
}

export default React.memo(ActionButton) as typeof ActionButton;
