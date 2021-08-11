import {ReactNode} from 'react';

import ItemModel from './ItemModel';

export type ValueGetter<ItemType, ValueType> =
  ((item: ItemType, fieldModel: FieldModel<ItemType, ValueType>, itemType: ItemModel<ItemType>) => ValueType);

export interface FilterCellRendererProps<ItemType, ValueType, FilterValueType> {
  field: FieldModel<ItemType, ValueType>;
  filterBy: FilterValueType;
  onFilterByChange: (filterBy: FilterValueType) => unknown;
}

export interface FilterValueConverter<F> {
  fromStrings: (str: string[]) => F | undefined;
  toStrings: (filterBy: F) => string[];
}

export interface ValueRendererProps<ItemType, ValueType> {
  value: ValueType;
  item: ItemType;
}

interface FieldModel<ItemType, ValueType> {
  key: string;
  title: string;
  description?: ReactNode;
  hiddenByDefault?: boolean;

  sortable?: boolean;
  renderFilterCell?: React.ComponentType<FilterCellRendererProps<ItemType, ValueType, unknown>>;
  filterValueConverter?: FilterValueConverter<unknown>;

  getter?: ValueGetter<ItemType, ValueType>;
  render?: React.ComponentType<ValueRendererProps<ItemType, ValueType>>;
  headerCellContent?: React.ComponentType<{field: FieldModel<ItemType, ValueType>}>;
  headerCellProps?: React.ComponentProps<'th'>;
  valueCellProps?: (value: ValueType, item: ItemType, fieldModel: FieldModel<ItemType, ValueType>) => Record<string, unknown>;
}

export const defaultGetter =
  <I, V>(item: I, fieldModel: FieldModel<I, V>): V =>
    (item as Record<string, unknown>)[fieldModel.key] as V;

export function defaultFilterValueConverter<F> (): FilterValueConverter<F> {
  return {
    fromStrings: (src: string[]) => {
      const firstValue = src?.[0];
      if (!firstValue) return undefined;
      return JSON.parse(firstValue) as F;
    },
    toStrings: (value: F) => [JSON.stringify(value)],
  };
}

const EMPTY_PROPS = Object.freeze({}) as Record<string, unknown>;

export function defaultHeaderCellProps<I, V> (): ((fieldModel: FieldModel<I, V>) => Record<string, unknown>) {
  return () => EMPTY_PROPS;
}

export function defaultValueCellProps<I, V> (): ((value: V, item: I, fieldModel: FieldModel<I, V>) => Record<string, unknown>) {
  return () => EMPTY_PROPS;
}

export function defaultRender<ValueType> (
    {value}: ValueRendererProps<ValueType, unknown>
): ReactNode {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    return value;
  }
  return JSON.stringify(value);
}

export default FieldModel;
