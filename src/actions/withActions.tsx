import React, {PureComponent, ReactNode} from 'react';
import Action from './Action';
import ControlledPropsType from '../controlled/ControlledPropsType';
import ItemModel from '../ItemModel';
import {NewComponentProps as SelectablePropsType} from '../withSelectable';
import Toolbar from './Toolbar';

export type RequiredChildComponentProps<T> =
  Pick<SelectablePropsType, 'onSelectedIdsChange' | 'selectable' | 'selectedIds'> &
  Pick<ControlledPropsType<T>, 'footer' | 'itemModel' | 'page' | 'size'>;

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

function filterItemsByIdsImpl<T> (
    itemModel: ItemModel<T>,
    items: T[],
    ids: string[]): T[] {
  const item2Id: (item: T) => string = itemModel.idF;
  const idsSet: Set< string > = new Set(ids);
  return items.filter(item => idsSet.has(item2Id(item)));
}

const withActions = <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>):
React.ComponentType<NewComponentProps<T> & Omit<P, 'onSelectedIdsChange' | 'selectedIds'>> =>
    class WithActions extends PureComponent<NewComponentProps<T> & Omit<P, 'onSelectedIdsChange' | 'selectedIds'>, StateType> {

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
    const {actions, selectable, ...etcProps} = this.props;
    const {selectedIds} = this.state;

    if (!actions || actions.length === 0) {
      return <Child
        {...etcProps as unknown as P}
        onSelectedIdsChange={this.handleSelectedIdsChange}
        selectable={selectable}
        selectedIds={selectedIds} />;
    }

    return <Child
      {...etcProps as unknown as P}
      footer={this.renderFooter}
      onSelectedIdsChange={this.handleSelectedIdsChange}
      selectable
      selectedIds={selectedIds} />;
  }

  renderFooter = (tableColumnsCount: number): ReactNode => {
    const {actions, footer, itemModel, page, size} = this.props;
    const {selectedIds} = this.state;

    return <>
      <tr>
        <td colSpan={tableColumnsCount}>
          <Toolbar
            actions={actions}
            onAfterAction={this.handleAfterAction}
            selectedItems={filterItemsByIdsImpl(itemModel, page.content, selectedIds)}
            size={size} />
        </td>
      </tr>
      {footer && footer(tableColumnsCount)}
    </>;
  };
    };

export default withActions;
