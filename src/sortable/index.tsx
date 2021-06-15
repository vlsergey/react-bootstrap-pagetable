import React, {PureComponent, ReactNode} from 'react';
import ControlledPropsType from '../controlled/ControlledPropsType';
import SortableHeaderCell from './SortableHeaderCell';

export type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'columnHeaderCell' | 'fetchArgs' | 'itemModel' | 'onFetchArgsChange'>;

const withSortable = <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>):
React.ComponentType<Omit<P, 'columnHeaderCell'>> =>
    class WithSortable extends PureComponent<Omit<P, 'columnHeaderCell'>> {

      override render (): ReactNode {
        const {fetchArgs, itemModel, onFetchArgsChange, ...etcProps} = this.props;

        const tableSortable = itemModel.fields.some(({sortable}) => sortable);

        if (!tableSortable) {
          return <Child
            {...etcProps as P}
            fetchArgs={fetchArgs}
            itemModel={itemModel}
            onFetchArgsChange={onFetchArgsChange} />;
        }

        return <Child
          {...etcProps as P}
          columnHeaderCell={SortableHeaderCell}
          fetchArgs={fetchArgs}
          itemModel={itemModel}
          onFetchArgsChange={onFetchArgsChange} />;
      }

    };

export default withSortable;
