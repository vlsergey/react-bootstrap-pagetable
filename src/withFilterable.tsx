import ControlledBase, {PropsType as ControlledPropsType} from './ControlledBase';
import React, {PureComponent, ReactNode} from 'react';
import FieldModel from './FieldModel';

type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'columnHeaderCell' | 'columnHeaderRow' | 'fetchArgs' | 'itemModel' | 'onFetchArgsChange'>;

const withFilterable = <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>):
  React.ComponentType<Omit<P, 'columnHeaderRow'>> =>
    class WithFilterable extends PureComponent<Omit<P, 'columnHeaderRow'>> {

  renderColumnHeaderRow = (fieldsToRender: FieldModel<unknown>[]): ReactNode => {
    const {fetchArgs, onFetchArgsChange} = this.props;
    return <>
      <tr>{fieldsToRender.map(this.props.columnHeaderCell || ControlledBase.defaultProps.columnHeaderCell)}</tr>
      <tr>
        {fieldsToRender.map((field: FieldModel<unknown>) =>
          field.renderFilterCell
            ? field.renderFilterCell(
              field,
              (fetchArgs.filter || {})[ field.key ] || null,
              (newFilterBy: string) => onFetchArgsChange({
                ...fetchArgs,
                filter: {
                  ...fetchArgs.filter,
                  [ field.key ]: newFilterBy,
                }
              }))
            : <td key={field.key} />
        )}
      </tr>
    </>;
  };

  render (): ReactNode {
    const {fetchArgs, itemModel, onFetchArgsChange, ...etcProps} = this.props;

    const tableFilterable = itemModel.fields.some(({renderFilterCell}) => !!renderFilterCell);

    if (!tableFilterable) {
      return <Child
        {...etcProps as P}
        fetchArgs={fetchArgs}
        itemModel={itemModel}
        onFetchArgsChange={onFetchArgsChange} />;
    }

    return <Child
      {...etcProps as P}
      columnHeaderRow={this.renderColumnHeaderRow}
      fetchArgs={fetchArgs}
      itemModel={itemModel}
      onFetchArgsChange={onFetchArgsChange} />;
  }

    };

export default withFilterable;
