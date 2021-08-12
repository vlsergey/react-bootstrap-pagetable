import React, {useCallback} from 'react';

import {useControlledContext} from '../controlled/ControlledContext';
import FieldModel, {FilterCellRendererProps} from '../FieldModel';

interface PropsType<I, V, F> {
  field: FieldModel<I, V, F>;
}

const FieldFilterCell = <I, V, F>({field}: PropsType<I, V, F>): JSX.Element => {
  const {fetchArgs, onFetchArgsChange} = useControlledContext<I>();
  const onFilterByChange: ((filterBy: F) => unknown) =
    useCallback((newFilterBy: F) => onFetchArgsChange({
      ...fetchArgs,
      filter: {
        ...fetchArgs.filter,
        [field.key]: newFilterBy,
      }
    }), [field, fetchArgs, onFetchArgsChange]);

  if (!field.renderFilterCell) {
    return React.createElement('td');
  }

  const filterCellRenderer = field.renderFilterCell as unknown as
    React.FunctionComponent<FilterCellRendererProps<I, V, F>>;

  return React.createElement(filterCellRenderer, {
    field,
    filterBy: ((fetchArgs.filter || {})[field.key] || null) as F,
    onFilterByChange,
  });
};

export default React.memo(FieldFilterCell) as typeof FieldFilterCell;
