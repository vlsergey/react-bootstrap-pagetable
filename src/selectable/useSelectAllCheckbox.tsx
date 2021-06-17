import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import FieldModel from '../FieldModel';
import Form from 'react-bootstrap/Form';
import ItemModel from '../ItemModel';

export default function useSelectAllCheckbox<T> (
    content: T[],
    idF: ItemModel<T>['idF'],
    onSelectedIdsChange: (selectedIds: string[]) => unknown,
    selectedIdsSet: Set<string>
): Pick<FieldModel<T, unknown>, 'headerCellContent' | 'headerCellProps'> {
  const allPageIds: string[] = useMemo(() => content.map(idF), [ idF, content ]);

  const allChecked = useMemo(() => allPageIds.every(id => selectedIdsSet.has(id)),
    [ allPageIds, selectedIdsSet ]);
  const allUnchecked = useMemo(() => allPageIds.every(id => !selectedIdsSet.has(id)),
    [ allPageIds, selectedIdsSet ]);
  const allIndeterminate = !allChecked && !allUnchecked;

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current)
      ref.current.indeterminate = allIndeterminate;
  }, [ allIndeterminate ]);

  const handleTriggerAll = useCallback(({currentTarget: {checked}}: React.ChangeEvent<HTMLInputElement>) => {
    onSelectedIdsChange(checked ? allPageIds : []);
  }, [ allPageIds, onSelectedIdsChange ]);

  const handleCheckboxClick = useCallback((e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
  }, []);

  const handleCellClick = useCallback(() => {
    if (ref.current) {
      ref.current.click();
    }
  }, []);

  const selectAllCheckbox = useMemo((): (() => JSX.Element) => {
    const SelectAllCheckbox = () => <Form.Check
      checked={allChecked && !allUnchecked}
      onChange={handleTriggerAll}
      onClick={handleCheckboxClick}
      ref={ref}
      type="checkbox" />;
    return SelectAllCheckbox;
  }, [ allChecked, allUnchecked, handleTriggerAll, handleCheckboxClick, ref ]);

  return useMemo(() => ({
    headerCellContent: selectAllCheckbox,
    headerCellProps: {
      onClick: handleCellClick,
      style: {
        cursor: 'pointer',
      },
    },
  }), [ selectAllCheckbox, handleCellClick ]);
}
