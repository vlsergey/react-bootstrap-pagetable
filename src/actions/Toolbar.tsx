import React, { PureComponent, ReactNode } from 'react';
import Action from './Action';
import ActionButton from './ActionButton';
import { ButtonProps } from 'react-bootstrap/Button';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';

interface PropsType<T> {
  actions : Action<T>[];
  buttonProps: ( action : Action<T>, selectedItems : T[] ) => Record<string, unknown>;
  toolbarProps: Record<string, unknown>;
  onAfterAction : ( action : Action<T>, items : T[] ) => unknown;
  selectedItems : T[];
  size?: ButtonProps['size'];
}

const EMPTY_ACTIONS = [] as Action<unknown>[];
const EMPTY_PROPS = {} as Record<string, unknown>;

export default class Toolbar<T> extends PureComponent<PropsType<T>> {

  static defaultProps = {
    actions: EMPTY_ACTIONS,
    buttonProps: () : Record<string, unknown> => EMPTY_PROPS,
    toolbarProps: EMPTY_PROPS,
    onAfterAction: (): void => { /* NOOP */ },
  };

  handleAction = async( action : Action<T> ) : Promise< unknown > => {
    const { onAfterAction, selectedItems } = this.props;
    try {
      return await action.onAction( selectedItems );
    } finally {
      if ( onAfterAction ) {
        await onAfterAction( action, selectedItems );
      }
    }
  }

  render() : ReactNode {
    const { actions, buttonProps, selectedItems, size, toolbarProps } = this.props;

    const buttons : ReactNode[] = actions
      .filter( ( { visible } : Action<T> ) => !visible || visible( selectedItems ) )
      .map( ( action : Action<T> ) => <ActionButton
        action={action}
        disabled={action.enabled && !action.enabled( selectedItems )}
        key={action.key}
        onAction={this.handleAction}
        size={size}
        {...( buttonProps ? buttonProps( action, selectedItems ) : {} )} /> );
    if ( !buttons.length ) {
      return null;
    }
    return <ButtonToolbar {...( toolbarProps || {} )}>{buttons}</ButtonToolbar>;
  }
}
