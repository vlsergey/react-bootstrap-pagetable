import React, {PureComponent, ReactNode} from 'react';
import ColumnHeaderRowWithFilter from './ColumnHeaderRowWithFilter';
import ControlledPropsType from '../controlled/ControlledPropsType';

type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'columnHeaderCell' | 'columnHeaderRow' | 'fetchArgs' | 'itemModel' | 'onFetchArgsChange'>;

const withFilterable = <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>):
React.ComponentType<P> =>
    class WithFilterable extends PureComponent<P> {

      BindedColumnHeaderRowWithFilter = (): JSX.Element =>
        <ColumnHeaderRowWithFilter columnHeaderRow={this.props.columnHeaderRow} />;

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
          columnHeaderRow={this.BindedColumnHeaderRowWithFilter}
          fetchArgs={fetchArgs}
          itemModel={itemModel}
          onFetchArgsChange={onFetchArgsChange} />;
      }

    };

export default withFilterable;
