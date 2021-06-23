import React, {PureComponent, ReactNode} from 'react';
import Action from './Action';
import ActionsContext from './ActionsContext';
import ActionsToolbar from './ActionsToolbar';
import ControlledPropsType from '../controlled/ControlledPropsType';
import {NewComponentProps as SelectablePropsType} from '../selectable/withSelectable';

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

export type StateType = {
  selectedIds: string[];
};

const withActions = <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>):
React.ComponentType<NewComponentProps<T> & Omit<P, 'onSelectedIdsChange' | 'selectedIds'>> =>
    class WithActions extends PureComponent<NewComponentProps<T> & Omit<P, 'onSelectedIdsChange' | 'selectedIds'>, StateType> {

  static defaultProps = Child.defaultProps;

  override state = {
    selectedIds: [] as string[],
  };

  handleAfterAction = async (action: Action<T>, items: T[]) => {
    const {onAfterAction} = this.props;
    if (onAfterAction) {
      await onAfterAction(action, items);
    }

    if (action.refreshAfterAction && this.props.onRefreshRequired) {
      await this.props.onRefreshRequired();
    }
  };

  handleSelectedIdsChange = (selectedIds: string[]) => {
    this.setState({selectedIds});
    if (this.props.onSelectedIdsChange) {
      this.props.onSelectedIdsChange(selectedIds);
    }
  };

  override render (): ReactNode {
    const {actions, buttonProps, footerElements, onAfterAction,
      onRefreshRequired, selectable, ...etcProps} = this.props;
    const {selectedIds} = this.state;

    return <ActionsContext.Provider value={{
      actions,
      buttonProps,
      onAfterAction,
      onRefreshRequired,
      selectedIds,
    }}>
      {!actions || actions.length === 0
        ? <Child
          {...etcProps as unknown as P}
          footerElements={footerElements}
          onSelectedIdsChange={this.handleSelectedIdsChange}
          selectable={selectable}
          selectedIds={selectedIds} />

        : <Child
          {...etcProps as unknown as P}
          footerElements={[
            ...footerElements || [],
            [ [ ActionsToolbar ] ],
          ]}
          onSelectedIdsChange={this.handleSelectedIdsChange}
          selectable
          selectedIds={selectedIds} />
      }</ActionsContext.Provider>;
  }

    };

export default withActions;
