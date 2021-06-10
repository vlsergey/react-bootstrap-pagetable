import ControlledBase, {PropsType as ControlledPropsType} from './controlled';
import React, {PureComponent, ReactNode} from 'react';
import FieldFilterCell from './FieldFilterCell';
import FieldModel from './FieldModel';

type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'columnHeaderCell' | 'columnHeaderRow' | 'fetchArgs' | 'itemModel' | 'onFetchArgsChange'>;

const withFilterable = <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>):
  React.ComponentType<Omit<P, 'columnHeaderRow'>> =>
    class WithFilterable extends PureComponent<Omit<P, 'columnHeaderRow'>> {

  renderColumnHeaderRow = (fieldsToRender: FieldModel<unknown, unknown>[]): ReactNode => {
    const {fetchArgs, onFetchArgsChange} = this.props;
    return <>
      <tr>{fieldsToRender.map(this.props.columnHeaderCell || ControlledBase.defaultProps.columnHeaderCell)}</tr>
      <tr>
        {fieldsToRender.map((field: FieldModel<unknown, unknown>) =>
          <FieldFilterCell
            fetchArgs={fetchArgs}
            field={field}
            key={field.key}
            onFetchArgsChange={onFetchArgsChange} />
        )}
      </tr>
    </>;
  };

  override render (): ReactNode {
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
