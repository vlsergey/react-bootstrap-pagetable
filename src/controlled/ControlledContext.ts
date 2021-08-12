import React, {useContext} from 'react';

import FieldModel from '../FieldModel';
import ColumnHeaderCellPropsType from './ColumnHeaderCellPropsType';
import ControlledPropsType from './ControlledPropsType';
import ItemFieldCellLinkWrapperProps from './ItemFieldCellLinkWrapperProps';
import ItemFieldCellRendererPropsType from './ItemFieldCellRendererPropsType';

// TODO: split

export interface ControlledContextType<T>
  extends ControlledPropsType<T> {

  // mark all props as required
  columnHeaderCell: React.ComponentType<ColumnHeaderCellPropsType<T, unknown, unknown>>;
  columnHeaderRow: React.ComponentType<unknown>;
  footerElements: (React.ComponentType<unknown>)[][][];
  headerElements: (React.ComponentType<unknown>)[][][];
  itemFieldCellHyperlink: <V, F>(item: T, field: FieldModel<T, V, F>) => null | string | undefined;
  itemFieldCellLinkWrapper: React.ComponentType<ItemFieldCellLinkWrapperProps<T, unknown, unknown>>;
  itemFieldCellRenderer: React.ComponentType<ItemFieldCellRendererPropsType<T, unknown, unknown>>;
  noContentRow: React.ComponentType<unknown>;

  // additional context props
  onVisibleFieldsChange: (newVisibleFields: string[]) => unknown;
  visibleFields: string[];
}

const ControlledContext = React.createContext<ControlledContextType<unknown>>(
  null as unknown as ControlledContextType<unknown>);
export default ControlledContext;

export function useControlledContext<T> (): ControlledContextType<T> {
  return useContext(ControlledContext) as unknown as ControlledContextType<T>;
}
