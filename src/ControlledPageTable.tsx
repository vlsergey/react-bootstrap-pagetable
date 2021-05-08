import FieldModel, { defaultGetter, defaultRender } from './FieldModel';
import React, { PureComponent, ReactNode } from 'react';
import Alert from 'react-bootstrap/Alert';
import FetchArgs from './FetchArgs';
import Form from 'react-bootstrap/Form';
import ItemModel from './ItemModel';
import Page from './Page';
import Pagination from '@vlsergey/react-bootstrap-pagination';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';

type IdFunction<T> = ( item : T ) => string;

export interface PropsType<T> {
  columnHeaderCell?: ( field : FieldModel<unknown> ) => ReactNode;
  columnHeaderRow?: ( fieldsToRender : FieldModel<unknown>[] ) => ReactNode;
  error? : unknown & {message? : string};
  fetchArgs: FetchArgs;
  footer? : ( tableColumnsCount: number ) => ReactNode;
  itemModel: ItemModel<T>;
  hasError: boolean;
  loading : boolean;
  noContentRow?: ( tableColumnsCount: number ) => ReactNode;
  onFetchArgsChange: ( fetchArgs : FetchArgs ) => unknown;
  page : Page<T>;
  rowProps?: ( item : T ) => React.ComponentProps<'tr'>;
  size?: 'lg' | 'sm';
  tableProps?: React.ComponentProps<Table>;
}

export default class ControlledPageTable<T> extends PureComponent<PropsType<T>> {

  static defaultProps = {
    hasError: false,
    columnHeaderCell: ( field : FieldModel<unknown> ) : ReactNode => <th key={field.key}>
      {field.title}
    </th>,
    loading: true,
    noContentRow: ( tableColumnsCount: number ) : ReactNode => <tr key="$_noContentRow">
      <td colSpan={tableColumnsCount}>
        <em>no content on this page, select another page to display</em>
      </td>
    </tr>,
    tableProps: {
      bordered: true,
      hover: true,
      striped: true,
      style: {
        width: 'auto !important'
      }
    },
  }

  defaultCellHeaderRow = ( fieldsToRender : FieldModel<unknown>[] ) : ReactNode =>
    <tr>{fieldsToRender.map( this.props.columnHeaderCell )}</tr>;

  private handlePageChange = ( { target: { value } } : {target: {value: number}} ) => {
    const { fetchArgs, onFetchArgsChange } = this.props;
    onFetchArgsChange( { ...fetchArgs, page: value } );
  }

  private handleSizeChange = ( { target: { value } } : React.ChangeEvent<HTMLSelectElement> ) => {
    const { fetchArgs, onFetchArgsChange } = this.props;
    onFetchArgsChange( { ...fetchArgs, size: Number( value ) } );
  }

  render() : ReactNode {
    const { footer, itemModel, hasError, loading, noContentRow, page, rowProps,
      size, tableProps } = this.props;

    const item2id : IdFunction<T> = itemModel.idF;
    const fieldsCount : number = itemModel.fields.length;

    // memoize?
    const actualTableProps : Record<string, unknown> = {
      size,
      ...tableProps
    };

    // TODO: allow user to change
    const fieldsToRender : FieldModel<unknown>[] = itemModel.fields;

    return <Table {...actualTableProps}>
      {this.renderHeader( fieldsToRender )}
      <tbody>
        { !loading && !hasError && page.content.length == 0 &&
           noContentRow( fieldsCount ) }
        { page.content.map( ( item : T ) =>
          <tr key={item2id( item )} {...( rowProps ? rowProps( item ) : {} )}>
            { fieldsToRender.map( ( field:FieldModel<unknown> ) =>
              <td key={field.key}>
                {this.renderValueCellContent( field, item )}
              </td>
            ) }
          </tr>
        ) }
      </tbody>
      <tfoot>
        {this.renderPageSizeControlRow( fieldsCount )}
        {footer && footer( fieldsCount )}
      </tfoot>
    </Table>;
  }

  private renderHeader( fieldsToRender : FieldModel<unknown>[] ) : ReactNode {
    const { columnHeaderRow, hasError, error, loading } = this.props;
    const fieldsCount : number = fieldsToRender.length;

    return <thead>
      {this.renderPageSizeControlRow( fieldsCount )}
      {( columnHeaderRow || this.defaultCellHeaderRow )( fieldsToRender )}
      { loading && <tr>
        <td colSpan={fieldsCount}>
          <ProgressBar animated max={100} min={0} now={100} />
        </td>
      </tr> }
      { hasError && <tr>
        <td colSpan={fieldsCount}>
          <Alert style={{ margin: 0 }} variant="danger">
            {'Error occured while loading'}
            { !!error && `: ${error.message || JSON.stringify( error )}`}
          </Alert>
        </td>
      </tr> }
    </thead>;
  }

  private renderValueCellContent<T, V>( field: FieldModel<V>, item: T ) {
    const fieldValue : V = ( field.getter || defaultGetter() )( item, field );
    const rendered : ReactNode = ( field.render || defaultRender() )( fieldValue, item );
    return rendered;
  }

  private renderPageSizeControlRow( tableColumnsCount: number ) : ReactNode {
    const { fetchArgs, page, size } = this.props;
    return <tr>
      <td colSpan={tableColumnsCount}>
        <div style={{ float: 'right' }}>
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
          style={{ margin: 0 }}
          totalPages={page.totalPages}
          value={fetchArgs.page} />
      </td>
    </tr>;
  }
}
