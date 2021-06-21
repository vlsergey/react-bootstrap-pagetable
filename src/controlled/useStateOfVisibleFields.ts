import {useCallback, useMemo, useState} from 'react';
import FieldModel from '../FieldModel';
import ItemModel from '../ItemModel';

type ResultType = [
  string[],
  (newVisibleFields: string[]) => unknown
];

function useLocalStorage (
    idPrefix: string,
    key: string,
    defaultValues: string[]
): ResultType {
  const [ valuesReact, setValuesReact ] = useState<string[]>(() => {
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
  }, [ idPrefix, key, setValuesReact ]);

  return [ valuesReact, setValues ];
}

export default function useStateOfVisibleFields (
    disableVisibleFieldsChange: boolean,
    idPrefix: string,
    itemModel: ItemModel<unknown>
): ResultType {

  const defaultKeysOrder: string[] = useMemo(() => itemModel
    .fields
    .filter(({hiddenByDefault}: FieldModel<unknown, unknown>) => !hiddenByDefault)
    .map(({key}: FieldModel<unknown, unknown>) => key), [ itemModel ]);

  const defaultHidden = [] as string[];

  const [ hidden, setHidden ] = useLocalStorage(idPrefix, 'hidden', defaultHidden);
  const [ order, setOrder ] = useLocalStorage(idPrefix, 'order', defaultKeysOrder);

  const visibleFields = useMemo(() => {
    const result = order.filter((key: string) => !hidden.includes(key));
    const invisibleBecauseNotInConfig =
      defaultKeysOrder.filter(key => !order.includes(key) && !hidden.includes(key));

    // need to include invisible-because-unknown-before fields into result
    invisibleBecauseNotInConfig.forEach(fieldKey => {
      const insertAfterIndex: number = defaultKeysOrder.indexOf(fieldKey);
      while (insertAfterIndex > 0) {
        const fieldKeyAtIndex = defaultKeysOrder[ insertAfterIndex ];
        const currentIndex = result.indexOf(fieldKeyAtIndex);
        if (currentIndex !== -1) {
          result.splice(currentIndex + 1, 0, fieldKey);
          return;
        }
      }
      result.splice(0, 0, fieldKey);
    });

    return result;
  }, [ defaultKeysOrder, order, hidden ]);

  const setVisibleFields = useCallback((newVisibleFields: string[]) => {
    const newHiddenFields = defaultKeysOrder.filter(key => !newVisibleFields.includes(key));
    setHidden(newHiddenFields);
    setOrder(newVisibleFields);
  }, [ defaultKeysOrder, setHidden, setOrder ]);

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
