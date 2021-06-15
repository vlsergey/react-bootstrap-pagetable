import FieldModel, {FilterCellRendererProps} from './FieldModel';
import React, {useCallback} from 'react';
import FetchArgs from './FetchArgs';

interface PropsType<ItemType, ValueType> {
  field: FieldModel<ItemType, ValueType>;
  fetchArgs: FetchArgs;
  onFetchArgsChange: (fetchArgs: FetchArgs) => unknown;
}

const FieldFilterCell =
  <ItemType, ValueType, FilterValueType>({field, fetchArgs, onFetchArgsChange}: PropsType<ItemType, ValueType>): JSX.Element => {
    const onFilterByChange: ((filterBy: FilterValueType) => unknown) =
      useCallback((newFilterBy: FilterValueType) => onFetchArgsChange({
        ...fetchArgs,
        filter: {
          ...fetchArgs.filter,
          [ field.key ]: newFilterBy,
        }
      }), [ field, fetchArgs, onFetchArgsChange ]);

    if (!field.renderFilterCell) {
      return React.createElement('td');
    }

    const filterCellRenderer = field.renderFilterCell as unknown as
      React.FunctionComponent<FilterCellRendererProps<ItemType, ValueType, FilterValueType>>;

    return React.createElement(filterCellRenderer, {
      field,
      filterBy: ((fetchArgs.filter || {})[ field.key ] || null) as FilterValueType,
      onFilterByChange,
    });
  };

export default FieldFilterCell;
