import ColumnHeaderCellPropsType from './ColumnHeaderCellPropsType';
import FetchArgs from '../FetchArgs';
import ItemFieldCellRendererPropsType from './ItemFieldCellRendererPropsType';
import ItemModel from '../ItemModel';
import Page from '../Page';
import Table from 'react-bootstrap/Table';

interface ControlledPropsType<T> {
  columnHeaderCell?: (props: ColumnHeaderCellPropsType) => JSX.Element;
  columnHeaderRow?: (props: unknown) => JSX.Element;
  disableVisibleFieldsChange?: boolean;
  error?: unknown & {message?: string};
  fetchArgs: FetchArgs;
  footer?: (tableColumnsCount: number) => JSX.Element;
  footerElements?: ((props: unknown) => JSX.Element)[][],
  footerRenderer?: (props: unknown) => JSX.Element;
  idPrefix?: string;
  itemModel: ItemModel<T>;
  itemFieldCellRenderer?: (props: ItemFieldCellRendererPropsType<T, unknown>) => JSX.Element;
  hasError?: boolean;
  headerElements?: ((props: unknown) => JSX.Element)[][],
  headerRenderer?: (props: unknown) => JSX.Element;
  loading?: boolean;
  noContentRow?: (props: unknown) => JSX.Element;
  onFetchArgsChange: (fetchArgs: FetchArgs) => unknown;
  page: Page<T>;
  rowsRenderer?: (props: unknown) => JSX.Element;
  rowProps?: (item: T) => React.ComponentProps<'tr'>;
  size?: 'lg' | 'sm';
  tableProps?: React.ComponentProps<Table>;
}

export default ControlledPropsType;
