import FieldModel, { defaultGetter } from './FieldModel';
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
  error? : unknown & {message? : string};
  fetchArgs: FetchArgs;
  footer? : ( tableColumnsCount: number ) => ReactNode;
  itemModel: ItemModel<T>;
  onFetchArgsChange: ( fetchArgs : FetchArgs ) => unknown;
  tableProps?: React.ComponentProps<Table>;
  rowProps?: ( item : T ) => React.ComponentProps<'tr'>;
  hasError: boolean;
  loading : boolean;
  page : Page<T>;
  size?: 'sm';
}

export default class UncontolledPageTable<T> extends PureComponent<PropsType<T>> {

  static defaultProps = {
    fetchArgs: {
      page: 0,
      size: 0,
    },
    hasError: false,
    loading: true,
    tableProps: {
      bordered: true,
      hover: true,
      striped: true,
      style: {
        width: 'auto !important'
      }
    },
  }

  private handlePageChange = ( { target: { value } } : {target: {value: number}} ) => {
    const { fetchArgs, onFetchArgsChange } = this.props;
    onFetchArgsChange( { ...fetchArgs, page: value } );
  }

  private handleSizeChange = ( { target: { value } } : React.ChangeEvent<HTMLSelectElement> ) => {
    const { fetchArgs, onFetchArgsChange } = this.props;
    onFetchArgsChange( { ...fetchArgs, size: Number( value ) } );
  }

  render() : ReactNode {
    const { footer, itemModel, hasError, error, loading, page, rowProps, size,
      tableProps } = this.props;

    const item2id : IdFunction<T> = itemModel.idF;
    const fieldsCount : number = itemModel.fields.length;

    // memoize?
    const actualTableProps : Record<string, unknown> = {
      size,
      ...tableProps
    };

    return <Table {...actualTableProps}>
      <thead>
        {this.renderPageSizeControlRow( fieldsCount )}
        <tr>
          { itemModel.fields.map( ( field:FieldModel<unknown> ) =>
            <th key={field.key}>
              {field.title}
            </th>
          ) }
        </tr>
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
      </thead>
      <tbody>
        { page.content.map( ( item : T ) =>
          <tr key={item2id( item )} {...( rowProps ? rowProps( item ) : {} )}>
            { itemModel.fields.map( ( field:FieldModel<unknown> ) =>
              <td key={field.key}>
                {field.render( ( field.getter || defaultGetter() )( item, field ), item )}
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
            <option>5</option>
            <option>10</option>
            <option>25</option>
            <option>50</option>
            <option>100</option>
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
