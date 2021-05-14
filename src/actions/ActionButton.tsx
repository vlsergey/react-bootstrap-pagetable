import Button, {PropsType as ButtonPropsType}
  from '@vlsergey/react-bootstrap-button-with-spinner';
import React, {PureComponent, ReactNode} from 'react';
import Action from './Action';

export interface PropsType<T> extends ButtonPropsType {
  action: Action<T>;
  disabled: boolean;
  onAction: (action: Action<T>) => unknown;
  onClick?: (event: React.MouseEvent<HTMLElement>) => unknown;
}

export default class ActionButton<T> extends PureComponent<PropsType<T>> {

  handleClick = async (event: React.MouseEvent<HTMLElement>): Promise<unknown> => {
    const {action, onAction, onClick} = this.props;
    if (onClick) {
      await onClick(event);
    }
    return onAction(action);
  };

  render (): ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "onAction|onClick" }] */
    const {action, onAction, disabled, onClick, ...etcProps} = this.props;

    return <Button
      className={'mr-2'}
      disabled={disabled}
      onClick={this.handleClick}
      variant={action.variant}
      {...etcProps}>
      {action.title}
    </Button>;
  }
}
