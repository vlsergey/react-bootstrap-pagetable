import {useCallback, useMemo, useState} from 'react';
import FieldModel from '../FieldModel';
import ItemModel from '../ItemModel';

type ResultType = [
  string[],
  (newVisibleFields: string[]) => unknown
];

export default function useStateOfVisibleFields (
    disableVisibleFieldsChange: boolean,
    idPrefix: string,
    itemModel: ItemModel<unknown>
): ResultType {

  const [ visibleFields, setVisibleFieldsImpl ] = useState<string[]>(() => {
    if (!!idPrefix && !!localStorage) {
      try {
        const json = localStorage.getItem(idPrefix + '_useVisibleFieldsState');
        if (json) {
          const keys = JSON.parse(json) as string[];
          if (keys.length > 0) {
            return keys;
          }
        }
      } catch (error: unknown) {
        console.warn('Unable to load visible columns state from localStorage');
        console.warn(error);
      }
    }

    return itemModel
      .fields
      .filter(({hiddenByDefault}: FieldModel<unknown, unknown>) => !hiddenByDefault)
      .map(({key}: FieldModel<unknown, unknown>) => key);
  });

  const setVisibleFields = useCallback((newVisibleFields: string[]) => {
    setVisibleFieldsImpl(newVisibleFields);
    try {
      if (!!idPrefix && !!localStorage) {
        localStorage.setItem(idPrefix + '_useVisibleFieldsState', JSON.stringify(newVisibleFields));
      }
    } catch (error: unknown) {
      console.warn('Unable to save visible columns state to localStorage');
      console.warn(error);
    }
  }, [ idPrefix, setVisibleFieldsImpl ]);

  const mockVisibleFields = useMemo<string[]>(() => itemModel
    .fields
    .filter(({hiddenByDefault}: FieldModel<unknown, unknown>) => !hiddenByDefault)
    .map(({key}: FieldModel<unknown, unknown>) => key), [ itemModel ]);
  const setMockVisibleFields = useCallback(() => {
    throw new Error('Visible fields changing feature is disabled');
  }, []);

  if (disableVisibleFieldsChange) {
    return [ mockVisibleFields, setMockVisibleFields as (value: string[]) => unknown ];
  }

  return [ visibleFields, setVisibleFields ];
}
