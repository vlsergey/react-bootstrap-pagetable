import Button from '@vlsergey/react-bootstrap-button-with-spinner';
import React, {useCallback} from 'react';
import {ButtonProps} from 'react-bootstrap/Button';

import Action from './Action';

export interface PropsType<T> {
  action: Action<T>;
  disabled: boolean;
  onAction: (action: Action<T>, ...etc: unknown[]) => unknown;
  size: ButtonProps['size'];
}

function ActionButton<T> ({
  action,
  disabled,
  onAction,
  size,
  ...etcProps
}: PropsType<T>) {

  const handleClick = useCallback((...etc: unknown[]) => onAction(action, ...etc), [action, onAction]);

  const ActionButtonComponent = action.buttonComponent || Button;

  return <ActionButtonComponent
    className={'mr-2'}
    disabled={disabled}
    onClick={handleClick}
    size={size}
    variant={action.variant}
    {...etcProps}>
    {action.title}
  </ActionButtonComponent>;
}

export default React.memo(ActionButton) as typeof ActionButton;
