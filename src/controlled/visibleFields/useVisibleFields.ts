import {useMemo} from 'react';

import {notEmpty} from '../../arrayUtils';
import FieldModel from '../../FieldModel';
import {useControlledContext} from '../ControlledContext';

export default function useVisibleFields<T> (): FieldModel<T, unknown>[] {
  const {visibleFields, itemModel} = useControlledContext<T>();

  const allFields = itemModel.fields;
  const fieldsMap = useMemo(() =>
    new Map(allFields.map(field => [field.key, field]))
  , [allFields]);

  const result = useMemo(() =>
    visibleFields.map(fieldKey => fieldsMap.get(fieldKey)).filter(notEmpty)
  , [fieldsMap, visibleFields]);

  return result;
}
