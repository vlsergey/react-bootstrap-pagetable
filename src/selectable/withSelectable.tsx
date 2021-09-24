import React, {useCallback, useMemo} from 'react';
import Form from 'react-bootstrap/Form';

import ControlledPropsType from '../controlled/ControlledPropsType';
import FieldModel, {ValueRendererProps} from '../FieldModel';
import ItemModel from '../ItemModel';
import useSelectAllCheckbox from './useSelectAllCheckbox';

type RequiredChildComponentProps<T> = Pick<ControlledPropsType<T>,
  'itemFieldCellHyperlink' | 'itemModel' | 'page' | 'rowProps'>;

export interface NewComponentProps<T> {
  selectable?: boolean;
  onSelectedIdsChange: (selectedIds: string[]) => unknown;
  onSelectedItemsChange?: (selectedItems: (T | undefined)[]) => unknown;
  selectedIds: string[];
}

export type PropsType<T, P extends RequiredChildComponentProps<T>> =
  NewComponentProps<T> & P;

function renderCheckboxField<T> ({value}: ValueRendererProps<T, boolean>) {
  return <Form.Check checked={value} readOnly type="checkbox" />;
}

export default <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>) =>
  function WithSelectable ({
    itemFieldCellHyperlink,
    itemModel,
    page,
    selectable,
    onSelectedIdsChange,
    onSelectedItemsChange,
    selectedIds,
    ...etcProps
  }: PropsType<T, P>): JSX.Element {
    const idF = useMemo(() => itemModel.idF, [itemModel]);
    const selectedIdsSet = useMemo(() => new Set(selectedIds), [selectedIds]);

    const itemsMap: Map<string, T> = useMemo(() =>
      new Map(page.content.map(item => [itemModel.idF(item), item]))
    , [page, itemModel]);

    const handleTrigger = useCallback((item: T): unknown => {
      const itemKey: string = idF(item);

      const index = selectedIds.indexOf(itemKey);
      if (index === -1) {
        const newSelectedIds: string[] = [...selectedIds, itemKey];
        if (onSelectedItemsChange) {
          onSelectedItemsChange(newSelectedIds.map(id => itemsMap.get(id)));
        }
        return onSelectedIdsChange(newSelectedIds);
      }

      const spliced = [...selectedIds];
      spliced.splice(index, 1);
      if (onSelectedItemsChange) {
        onSelectedItemsChange(spliced.map(id => itemsMap.get(id)));
      }
      return onSelectedIdsChange(spliced);
    }, [idF, itemsMap, onSelectedIdsChange, onSelectedItemsChange, selectedIds]);

    const rowProps = useCallback((item: T): Record<string, unknown> => ({
      onClick: () => handleTrigger(item),
      style: {cursor: 'pointer'},
    }), [handleTrigger]);

    const selectableFieldGetter = useCallback((item: T): boolean =>
      selectedIdsSet.has(idF(item)),
    [idF, selectedIdsSet]);

    const selectAllProps = useSelectAllCheckbox(page.content, idF,
      onSelectedIdsChange, onSelectedItemsChange, selectedIdsSet);

    const newItemModel: ItemModel<T> = useMemo(() => ({
      ...itemModel,
      fields: [
        {
          key: '$selectable',
          getter: selectableFieldGetter,
          render: renderCheckboxField,
          title: '[item checkbox]',
          ...selectAllProps,
        } as FieldModel<T, boolean, never>,
        ...itemModel.fields,
      ] as FieldModel<T, unknown, unknown>[],
    }), [selectAllProps, itemModel, selectableFieldGetter]);

    const hasSelectedIds = selectedIds.length > 0;
    const newItemFieldCellHyperlink = useMemo(() => {
      if (!itemFieldCellHyperlink) return itemFieldCellHyperlink;
      return (item: T, field: FieldModel<T, unknown, unknown>) => {
        if (field.key === '$selectable' || hasSelectedIds) {
          return null;
        }
        return itemFieldCellHyperlink(item, field);
      };
    }, [itemFieldCellHyperlink, hasSelectedIds]);

    if (!selectable) {
      return <Child
        {...etcProps as unknown as P}
        itemFieldCellHyperlink={itemFieldCellHyperlink}
        itemModel={itemModel}
        page={page} />;
    }

    return <Child
      {...etcProps as unknown as P}
      itemFieldCellHyperlink={newItemFieldCellHyperlink}
      itemModel={newItemModel}
      page={page}
      rowProps={rowProps} />;
  };
