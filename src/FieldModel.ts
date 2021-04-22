import { ReactNode } from 'react';

interface FieldModel<V> {
  key : string;
  title : ReactNode;
  description? : string;

  getter? : ( item : unknown, fieldModel : FieldModel<V> ) => V,
  render : ( value : V, item : unknown ) => ReactNode;
  headerCellProps?: ( fieldModel : FieldModel<V> ) => Record<string, unknown>,
  valueCellProps?: ( value : V, item : unknown, fieldModel : FieldModel<V> ) => Record<string, unknown>,
}

export function defaultGetter<V, T>() : ( ( item : T, fieldModel : FieldModel<V> ) => V ) {
  return ( item : T, fieldModel : FieldModel<V> ) => ( item as Record<string, unknown> )[ fieldModel.key ] as V;
}

const EMPTY_PROPS = Object.freeze( {} ) as Record<string, unknown>;

export function defaultHeaderCellProps<V>() : ( ( fieldModel : FieldModel<V> ) => Record<string, unknown> ) {
  return () => EMPTY_PROPS;
}

export function defaultValueCellProps<V>() : ( ( value : V, item : unknown, fieldModel : FieldModel<V> ) => Record<string, unknown> ) {
  return () => EMPTY_PROPS;
}

export default FieldModel;
