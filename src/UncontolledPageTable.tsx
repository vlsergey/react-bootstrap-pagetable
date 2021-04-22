import FieldModel, { defaultGetter } from './FieldModel';
import React, { PureComponent, ReactNode } from 'react';
import Alert from 'react-bootstrap/Alert';
import FetchArgs from './FetchArgs';
import ItemModel from './ItemModel';
import Page from './Page';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Table from 'react-bootstrap/Table';

type IdFunction<T> = ( item : T ) => string;

export interface PropsType<T> {
  error? : unknown & {message? : string};
  fetchArgs: FetchArgs,
  itemModel: ItemModel<T>;
  tableProps?: React.ComponentProps<Table>;
  rowProps?: ( item : T ) => React.ComponentProps<'tr'>;
  hasError: boolean;
  loading : boolean;
  page : Page<T>;
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
      size: 'sm',
      striped: true,
      style: {
        width: 'auto !important'
      }
    }
  }

  render() : ReactNode {
    const { itemModel, hasError, error, loading, page, rowProps, tableProps } = this.props;

    const item2id : IdFunction<T> = itemModel.idF;
    const fieldsCount : number = itemModel.fields.length;

    return <Table {...tableProps}>
      <thead>
        <tr>
          { itemModel.fields.map( ( field:FieldModel<unknown> ) =>
            <th key={field.key}>
              {field.title}
            </th>
          ) }
        </tr>
      </thead>
      { loading && <tbody>
        <tr>
          <td colSpan={fieldsCount}>
            <ProgressBar animated max={100} min={0} now={100} />
          </td>
        </tr>
      </tbody> }
      { hasError && <tbody>
        <tr>
          <td colSpan={fieldsCount}>
            <Alert variant="danger">
              {'Error occured while loading'}
              { !!error && `: ${error.message || JSON.stringify( error )}`}
            </Alert>
          </td>
        </tr>
      </tbody> }
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
    </Table>;
  }
}
