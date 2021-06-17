import FieldModel, {ValueRendererProps} from '../FieldModel';
import React, {PureComponent, ReactNode} from 'react';
import ControlledPropsType from '../controlled/ControlledPropsType';
import ItemModel from '../ItemModel';
import memoizeOne from 'memoize-one';

type RequiredChildComponentProps<T> = Pick<ControlledPropsType<T>, 'itemModel' | 'rowProps'>;

export interface NewComponentProps {
  selectable?: boolean;
  onSelectedIdsChange: (selectedIds: string[]) => unknown;
  selectedIds: string[];
}

const renderCheckboxField = ({value}: ValueRendererProps<unknown, boolean>) =>
  <input checked={value} readOnly type="checkbox" />;

const withSelectable =
  <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>): React.ComponentType<NewComponentProps & P> =>
    class WithSelectable extends PureComponent<NewComponentProps & P> {

  getSelectedSet: ((selectedIds: string[]) => Set<string>) =
    memoizeOne((selectedIds: string[]) => new Set(selectedIds)) ;

  handleTrigger (item: T): unknown {
    const itemKey: string = this.props.itemModel.idF(item);
    const {onSelectedIdsChange, selectedIds} = this.props;

    const index = selectedIds.indexOf(itemKey);
    if (index === -1) {
      const newSelectedIds: string[] = [ ...selectedIds, itemKey ];
      return onSelectedIdsChange(newSelectedIds);
    }

    const spliced = [ ...selectedIds ];
    spliced.splice(index, 1);
    return onSelectedIdsChange(spliced);
  }

  rowProps: ((item: T) => Record<string, unknown>) = (item: T) => ({
    onClick: () => this.handleTrigger(item),
    style: {cursor: 'pointer'},
  });

  selectableFieldGetter = (item: T): boolean =>
    this.getSelectedSet(this.props.selectedIds).has(this.props.itemModel.idF(item));

  override render (): ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "onSelectedIdsChange|selectedIds" }] */
    const {itemModel, onSelectedIdsChange, selectable, selectedIds,
      ...etcProps} = this.props;

    if (!selectable) {
      return <Child itemModel={itemModel} {...etcProps as P} />;
    }

    const newItemModel: ItemModel<T> = {
      ...itemModel,
      fields: [
        {
          key: '$selectable',
          getter: this.selectableFieldGetter,
          render: renderCheckboxField,
          // TODO: add check-all checkbox
          title: <div />,
        } as FieldModel<T, boolean>,
        ...itemModel.fields,
      ]
    };

    return <Child
      {...etcProps as P}
      itemModel={newItemModel}
      rowProps={this.rowProps} />;
  }
    };

export default withSelectable;
