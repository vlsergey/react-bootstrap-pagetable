import FieldModel from '../../FieldModel';
import {useControlledContext} from '../ControlledContext';
import {useMemo} from 'react';

export default function useVisibleFields<T> (): FieldModel<T, unknown>[] {
  const {visibleFields, itemModel} = useControlledContext();

  const allFields: FieldModel<T, unknown>[] = itemModel.fields;
  const fieldsMap = useMemo(() =>
    new Map(allFields.map((field: FieldModel<unknown, unknown>) => [ field.key, field ]))
  , [ allFields ]);

  const result: FieldModel<T, unknown>[] = useMemo(() => visibleFields
    .map((fieldKey: string) => fieldsMap.get(fieldKey))
    .filter((field: FieldModel<unknown, unknown>) => !!field)
  , [ fieldsMap, visibleFields ]);

  return result;
}
