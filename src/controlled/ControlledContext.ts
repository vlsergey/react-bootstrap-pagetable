import React, {useContext} from 'react';
import ColumnHeaderCellPropsType from './ColumnHeaderCellPropsType';
import ControlledPropsType from './ControlledPropsType';

// TODO: split

export interface ControlledContextType<T>
  extends ControlledPropsType<T> {

  // mark all props as required
  columnHeaderCell: (props: ColumnHeaderCellPropsType) => JSX.Element;
  footerElements: ((props: unknown) => JSX.Element)[][][];
  headerElements: ((props: unknown) => JSX.Element)[][][];
  noContentRow: (props: unknown) => JSX.Element;

  // additional context props
  onVisibleFieldsChange: (newVisibleFields: string[]) => unknown;
  visibleFields: string[];
}

const ControlledContext = React.createContext<ControlledContextType<unknown>>(null);
export default ControlledContext;

export function useControlledContext<T> (): ControlledContextType<T> {
  return useContext(ControlledContext) as unknown as ControlledContextType<T>;
}
