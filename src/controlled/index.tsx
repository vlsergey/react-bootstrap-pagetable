import DefaultRowsRenderer, {PropsType as RowsRendererPropsType}
  from './DefaultRowsRenderer';
import React, {PureComponent, ReactNode} from 'react';
import Alert from 'react-bootstrap/Alert';
import DefaultHeaderFooter from './DefaultHeaderFooter';
import DefaultItemFieldCellRenderer from './DefaultItemFieldCellRenderer';
import FetchArgs from '../FetchArgs';
import FieldModel from '../FieldModel';
import HeaderFooterPropsType from './HeaderFooterPropsType';
import ItemFieldCellRendererPropsType from './ItemFieldCellRendererPropsType';
import ItemModel from '../ItemModel';
import Page from '../Page';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';

export interface PropsType<T> {
  columnHeaderCell?: (field: FieldModel<T, unknown>) => ReactNode;
  columnHeaderRow?: (fieldsToRender: FieldModel<T, unknown>[]) => ReactNode;
  error?: unknown & {message?: string};
  fetchArgs: FetchArgs;
  footer?: (tableColumnsCount: number) => ReactNode;
  footerRenderer?: (props: HeaderFooterPropsType<T>) => JSX.Element;
  itemModel: ItemModel<T>;
  itemFieldCellRenderer?: (props: ItemFieldCellRendererPropsType<T, unknown>) => JSX.Element;
  hasError?: boolean;
  headerRenderer?: (props: HeaderFooterPropsType<T>) => JSX.Element;
  loading?: boolean;
  noContentRow?: (tableColumnsCount: number) => ReactNode;
  onFetchArgsChange: (fetchArgs: FetchArgs) => unknown;
  page: Page<T>;
  rowsRenderer?: (props: RowsRendererPropsType<T>) => JSX.Element;
  rowProps?: (item: T) => React.ComponentProps<'tr'>;
  size?: 'lg' | 'sm';
  tableProps?: React.ComponentProps<Table>;
}

export default class ControlledBase<T> extends PureComponent<PropsType<T>> {

  static defaultProps = {
    columnHeaderCell: (field: FieldModel<unknown, unknown>): ReactNode => <th key={field.key}>
      {field.title}
    </th>,
    footerRenderer: DefaultHeaderFooter,
    hasError: false,
    headerRenderer: DefaultHeaderFooter,
    itemFieldCellRenderer: DefaultItemFieldCellRenderer,
    loading: false,
    noContentRow: (tableColumnsCount: number): ReactNode => <tr key="$_noContentRow">
      <td colSpan={tableColumnsCount}>
        <em>no content on this page, select another page to display</em>
      </td>
    </tr>,
    rowsRenderer: DefaultRowsRenderer,
    tableProps: {
      bordered: true,
      hover: true,
      striped: true,
      style: {
        width: 'auto !important'
      }
    },
  };

  defaultCellHeaderRow = (fieldsToRender: FieldModel<T, unknown>[]): ReactNode =>
    <tr>{fieldsToRender.map(this.props.columnHeaderCell)}</tr>;

  override render (): ReactNode {
    const {fetchArgs, footer, footerRenderer, itemFieldCellRenderer, itemModel,
      hasError, headerRenderer, loading, noContentRow, onFetchArgsChange, page,
      rowProps, size, tableProps} = this.props;

    const fieldsCount: number = itemModel.fields.length;

    // memoize?
    const actualTableProps: Record<string, unknown> = {
      size,
      ...tableProps
    };

    // TODO: allow user to change
    const fieldsToRender: FieldModel<T, unknown>[] = itemModel.fields;
    const RowsRenderer = this.props.rowsRenderer;

    return <>
      {React.createElement(headerRenderer, {fetchArgs, onFetchArgsChange, page, size})}
      <Table {...actualTableProps}>
        {this.renderHeader(fieldsToRender)}
        <tbody>
          { !loading && !hasError && page.content.length == 0 &&
             noContentRow(fieldsCount) }
          <RowsRenderer
            fieldsToRender={fieldsToRender}
            itemFieldCellRenderer={itemFieldCellRenderer}
            itemModel={itemModel}
            items={page.content}
            rowProps={rowProps} />
        </tbody>
        <tfoot>
          {footer && footer(fieldsCount)}
        </tfoot>
      </Table>
      {React.createElement(footerRenderer, {fetchArgs, onFetchArgsChange, page, size})}
    </>;
  }

  private renderHeader (fieldsToRender: FieldModel<T, unknown>[]): ReactNode {
    const {columnHeaderRow, hasError, error, loading} = this.props;
    const fieldsCount: number = fieldsToRender.length;

    return <thead>
      {(columnHeaderRow || this.defaultCellHeaderRow)(fieldsToRender)}
      { loading && <tr>
        <td colSpan={fieldsCount}>
          <ProgressBar animated max={100} min={0} now={100} />
        </td>
      </tr> }
      { hasError && <tr>
        <td colSpan={fieldsCount}>
          <Alert style={{margin: 0}} variant="danger">
            {'Error occured while loading'}
            { !!error && `: ${error.message || JSON.stringify(error)}`}
          </Alert>
        </td>
      </tr> }
    </thead>;
  }
}
