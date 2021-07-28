import Table from 'react-bootstrap/Table';

import FetchArgs from '../FetchArgs';
import FieldModel from '../FieldModel';
import ItemModel from '../ItemModel';
import Page from '../Page';
import ColumnHeaderCellPropsType from './ColumnHeaderCellPropsType';
import ItemFieldCellRendererPropsType from './ItemFieldCellRendererPropsType';

interface ControlledPropsType<T> {
  columnHeaderCell?: (props: ColumnHeaderCellPropsType) => JSX.Element;
  columnHeaderRow?: (props: unknown) => JSX.Element;
  disableVisibleFieldsChange?: boolean;
  error?: unknown & {message?: string};
  fetchArgs: FetchArgs;
  footerElements?: ((props: unknown) => JSX.Element)[][][];
  footerRenderer?: (props: unknown) => JSX.Element;
  idPrefix?: string;
  itemModel: ItemModel<T>;
  itemFieldCellHyperlink?: (item: T, field: FieldModel<T, unknown>) => string;
  itemFieldCellRenderer?: (props: ItemFieldCellRendererPropsType<T, unknown>) => JSX.Element;
  hasError?: boolean;
  headerElements?: ((props: unknown) => JSX.Element)[][][];
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
