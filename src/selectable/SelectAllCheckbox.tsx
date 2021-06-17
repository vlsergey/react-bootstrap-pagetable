import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import Form from 'react-bootstrap/Form';
import ItemModel from '../ItemModel';

interface PropsType<T> {
  idF: ItemModel<T>['idF'];
  content: T[];
  onSelectedIdsChange: (selectedIds: string[]) => unknown;
  selectedIdsSet: Set<string>;
}

export default function SelectAllCheckbox<T> ({
  content,
  idF,
  onSelectedIdsChange,
  selectedIdsSet,
}: PropsType<T>): JSX.Element {
  const allPageIds = useMemo(() => content.map(idF), [ idF, content ]);

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

  return <Form.Check
    checked={allChecked && !allUnchecked}
    onChange={handleTriggerAll}
    ref={ref}
    type="checkbox" />;
}
