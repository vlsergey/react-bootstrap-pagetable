import { ReactNode } from 'react';

export type FieldGetter<V> = ( ( item : unknown, fieldModel : FieldModel<V> ) => V );

export type FieldCellRenderer<V, F> = (
  filterBy : F,
  onFilterByChange : ( filterBy : F ) => unknown,
  fieldModel : FieldModel<V>
) => ReactNode;

interface FieldModel<V> {
  key : string;
  title : ReactNode;
  description? : ReactNode;

  sortable?: boolean;
  renderFilterCell? : FieldCellRenderer<V, unknown>;

  getter? : FieldGetter<V>,
  render? : ( value : V, item : unknown ) => ReactNode;
  headerCellProps?: ( fieldModel : FieldModel<V> ) => Record<string, unknown>;
  valueCellProps?: ( value : V, item : unknown, fieldModel : FieldModel<V> ) => Record<string, unknown>;
}

export function defaultGetter<V>() : FieldGetter<V> {
  return ( item : unknown, fieldModel : FieldModel<V> ) => ( item as Record<string, unknown> )[ fieldModel.key ] as V;
}

const EMPTY_PROPS = Object.freeze( {} ) as Record<string, unknown>;

export function defaultHeaderCellProps<V>() : ( ( fieldModel : FieldModel<V> ) => Record<string, unknown> ) {
  return () => EMPTY_PROPS;
}

export function defaultValueCellProps<V>() : ( ( value : V, item : unknown, fieldModel : FieldModel<V> ) => Record<string, unknown> ) {
  return () => EMPTY_PROPS;
}

export function defaultRender<V>() : ( ( value : V, item : unknown ) => ReactNode ) {
  return ( value : V ) => {
    if ( value === null || value === undefined ) {
      return null;
    }
    if ( typeof value === 'string' || typeof value === 'number' ) {
      return value;
    }
    return JSON.stringify( value );
  };
}

export default FieldModel;
