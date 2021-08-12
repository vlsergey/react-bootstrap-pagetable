import {useCallback, useMemo, useState} from 'react';

import FieldModel from '../../FieldModel';
import ItemModel from '../../ItemModel';
import calcFieldsOrderWithNewOnes from './calcFieldsOrderWithNewOnes';

type ResultType = [
  string[],
  (newVisibleFields: string[]) => unknown
];

function useLocalStorage (
    idPrefix: string | undefined,
    key: string,
    defaultValues: string[]
): ResultType {
  const [valuesReact, setValuesReact] = useState<string[]>(() => {
    if (!!idPrefix && !!localStorage) {
      try {
        const json = localStorage.getItem(idPrefix + '_useVisibleFieldsState_' + key);
        if (json) {
          const result = JSON.parse(json) as string[];
          if (result.length > 0) {
            return result;
          }
        }
      } catch (error: unknown) {
        console.warn('Unable to load ' + key + ' from localStorage');
        console.warn(error);
      }
    }
    return defaultValues;
  });

  const setValues = useCallback((newValues: string[]) => {
    setValuesReact(newValues);
    try {
      if (!!idPrefix && !!localStorage) {
        localStorage.setItem(idPrefix + '_useVisibleFieldsState_' + key,
          JSON.stringify(newValues));
      }
    } catch (error: unknown) {
      console.warn('Unable to save ' + key + ' to localStorage');
      console.warn(error);
    }
  }, [idPrefix, key, setValuesReact]);

  return [valuesReact, setValues];
}


export default function useStateOfVisibleFields<T> (
    disableVisibleFieldsChange: boolean,
    idPrefix: string | undefined,
    itemModel: ItemModel<T>
): ResultType {
  const allAllowedKeys: string[] = useMemo(() =>
    itemModel.fields.map(({key}) => key), [itemModel.fields]);
  const defaultKeysOrder: string[] = useMemo(() => itemModel
    .fields
    .filter(({hiddenByDefault}: FieldModel<T, unknown, unknown>) => !hiddenByDefault)
    .map(({key}: FieldModel<T, unknown, unknown>) => key), [itemModel.fields]);

  const defaultHidden = [] as string[];

  const [hidden, setHidden] = useLocalStorage(idPrefix, 'hidden', defaultHidden);
  const [order, setOrder] = useLocalStorage(idPrefix, 'order', defaultKeysOrder);

  const visibleFields = useMemo(() =>
    calcFieldsOrderWithNewOnes(allAllowedKeys, defaultKeysOrder, order, hidden)
  , [allAllowedKeys, defaultKeysOrder, order, hidden]);

  const setVisibleFields = useCallback((newVisibleFields: string[]) => {
    const newHiddenFields = defaultKeysOrder.filter(key => !newVisibleFields.includes(key));
    setHidden(newHiddenFields);
    setOrder(newVisibleFields);
  }, [defaultKeysOrder, setHidden, setOrder]);

  const mockVisibleFields = useMemo<string[]>(() => itemModel
    .fields
    .filter(({hiddenByDefault}: FieldModel<T, unknown, unknown>) => !hiddenByDefault)
    .map(({key}: FieldModel<T, unknown, unknown>) => key), [itemModel]);
  const setMockVisibleFields = useCallback(() => {
    throw new Error('Visible fields changing feature is disabled');
  }, []);

  if (disableVisibleFieldsChange) {
    return [mockVisibleFields, setMockVisibleFields as (value: string[]) => unknown];
  }

  return [visibleFields, setVisibleFields];
}
