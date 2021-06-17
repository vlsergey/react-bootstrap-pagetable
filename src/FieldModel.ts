import ItemModel from './ItemModel';
import {ReactNode} from 'react';

export type ValueGetter<ItemType, ValueType> =
  ((item: ItemType, fieldModel: FieldModel<ItemType, ValueType>, itemType: ItemModel<ItemType>) => ValueType);

export interface FilterCellRendererProps<ItemType, ValueType, FilterValueType> {
  field: FieldModel<ItemType, ValueType>;
  filterBy: FilterValueType;
  onFilterByChange: (filterBy: FilterValueType) => unknown;
}

export interface FilterValueConverter<F> {
  fromString: (str: string) => F;
  toString: (filterBy: F) => string;
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
  renderFilterCell?: (props: FilterCellRendererProps<ItemType, ValueType, unknown>) => ReactNode;
  filterValueConverter?: FilterValueConverter<unknown>;

  getter?: ValueGetter<ItemType, ValueType>;
  render?: (props: ValueRendererProps<ItemType, ValueType>) => ReactNode;
  headerCellContent?: (props: {field: FieldModel<ItemType, ValueType>}) => JSX.Element;
  headerCellProps?: React.ComponentProps<'th'>;
  valueCellProps?: (value: ValueType, item: ItemType, fieldModel: FieldModel<ItemType, ValueType>) => Record<string, unknown>;
}

export const defaultGetter =
  <I, V>(item: I, fieldModel: FieldModel<I, V>): V =>
    (item as Record<string, unknown>)[ fieldModel.key ] as V;

export function defaultFilterValueConverter (): FilterValueConverter<unknown> {
  return {
    fromString: JSON.parse,
    toString: JSON.stringify,
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
