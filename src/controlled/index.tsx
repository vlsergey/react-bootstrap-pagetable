import DefaultItemFieldCellRenderer, {PropsType as ItemFieldCellRendererProps}
  from './DefaultItemFieldCellRenderer';
import DefaultRowsRenderer, {PropsType as RowsRendererPropsType}
  from './DefaultRowsRenderer';
import React, {PureComponent, ReactNode} from 'react';
import Alert from 'react-bootstrap/Alert';
import FetchArgs from '../FetchArgs';
import FieldModel from '../FieldModel';
import Form from 'react-bootstrap/Form';
import ItemModel from '../ItemModel';
import Page from '../Page';
import Pagination from '@vlsergey/react-bootstrap-pagination';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';

export interface PropsType<T> {
  columnHeaderCell?: (field: FieldModel<T, unknown>) => ReactNode;
  columnHeaderRow?: (fieldsToRender: FieldModel<T, unknown>[]) => ReactNode;
  error?: unknown & {message?: string};
  fetchArgs: FetchArgs;
  footer?: (tableColumnsCount: number) => ReactNode;
  itemModel: ItemModel<T>;
  itemFieldCellRenderer?: (props: ItemFieldCellRendererProps<T, unknown>) => JSX.Element;
  hasError?: boolean;
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
    itemFieldCellRenderer: DefaultItemFieldCellRenderer,
    loading: false,
    hasError: false,
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

  private handlePageChange = ({target: {value}}: {target: {value: number}}) => {
    const {fetchArgs, onFetchArgsChange} = this.props;
    onFetchArgsChange({...fetchArgs, page: value});
  };

  private handleSizeChange = ({target: {value}}: React.ChangeEvent<HTMLSelectElement>) => {
    const {fetchArgs, onFetchArgsChange} = this.props;
    onFetchArgsChange({...fetchArgs, size: Number(value)});
  };

  render (): ReactNode {
    const {footer, itemFieldCellRenderer, itemModel, hasError, loading,
      noContentRow, page, rowProps, size, tableProps} = this.props;

    const fieldsCount: number = itemModel.fields.length;

    // memoize?
    const actualTableProps: Record<string, unknown> = {
      size,
      ...tableProps
    };

    // TODO: allow user to change
    const fieldsToRender: FieldModel<T, unknown>[] = itemModel.fields;
    const RowsRenderer = this.props.rowsRenderer;

    return <Table {...actualTableProps}>
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
        {this.renderPageSizeControlRow(fieldsCount)}
        {footer && footer(fieldsCount)}
      </tfoot>
    </Table>;
  }

  private renderHeader (fieldsToRender: FieldModel<T, unknown>[]): ReactNode {
    const {columnHeaderRow, hasError, error, loading} = this.props;
    const fieldsCount: number = fieldsToRender.length;

    return <thead>
      {this.renderPageSizeControlRow(fieldsCount)}
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

  private renderPageSizeControlRow (tableColumnsCount: number): ReactNode {
    const {fetchArgs, page, size} = this.props;
    return <tr>
      <td colSpan={tableColumnsCount}>
        <div style={{float: 'right'}}>
          <Form.Control
            as="select"
            name="size"
            onChange={this.handleSizeChange}
            size={size}
            value={fetchArgs.size}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Form.Control>
        </div>
        <Pagination
          name="page"
          onChange={this.handlePageChange}
          size={size}
          style={{margin: 0}}
          totalPages={page.totalPages}
          value={fetchArgs.page} />
      </td>
    </tr>;
  }
}
