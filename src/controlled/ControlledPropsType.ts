import Table from 'react-bootstrap/Table';

import FetchArgs from '../FetchArgs';
import FieldModel from '../FieldModel';
import ItemModel from '../ItemModel';
import Page from '../Page';
import ColumnHeaderCellPropsType from './ColumnHeaderCellPropsType';
import ItemFieldCellLinkWrapperProps from './ItemFieldCellLinkWrapperProps';
import ItemFieldCellRendererPropsType from './ItemFieldCellRendererPropsType';

interface ControlledPropsType<T> {
  columnHeaderCell?: React.ComponentType<ColumnHeaderCellPropsType<T, unknown>>;
  columnHeaderRow?: React.ComponentType<unknown>;
  disableVisibleFieldsChange?: boolean;
  error?: unknown;
  fetchArgs: FetchArgs;
  footerElements?: React.ComponentType<unknown>[][][];
  footerRenderer?: React.ComponentType<unknown>;
  idPrefix?: string;
  itemModel: ItemModel<T>;
  itemFieldCellHyperlink?: <V>(item: T, field: FieldModel<T, V>) => string | null | undefined;
  itemFieldCellLinkWrapper?: React.ComponentType<ItemFieldCellLinkWrapperProps<T, unknown>>;
  itemFieldCellRenderer?: React.ComponentType<ItemFieldCellRendererPropsType<T, unknown>>;
  hasError?: boolean;
  headerElements?: React.ComponentType<unknown>[][][];
  headerRenderer?: React.ComponentType<unknown>;
  loading?: boolean;
  noContentRow?: React.ComponentType<unknown>;
  onFetchArgsChange: (fetchArgs: FetchArgs) => unknown;
  page: Page<T>;
  rowsRenderer?: React.ComponentType<unknown>;
  rowProps?: (item: T) => React.ComponentProps<'tr'>;
  size?: 'lg' | 'sm';
  tableProps?: React.ComponentProps<Table>;
}

export default ControlledPropsType;
