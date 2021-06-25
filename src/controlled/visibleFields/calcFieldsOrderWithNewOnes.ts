
/**
* Returns order of fields including the ones that were added by developer after
user customizes his table columns order
*/
export default function calcFieldsOrderWithNewOnes (
    allAllowedKeys: string[],
    defaultKeysOrder: string[],
    orderedByConfig: string[],
    hiddenByConfig: string[]
): string[] {
  const result = orderedByConfig.filter((key: string) =>
    allAllowedKeys.includes(key) && !hiddenByConfig.includes(key));
  const invisibleBecauseNotInConfig =
    defaultKeysOrder.filter(key => !orderedByConfig.includes(key) && !hiddenByConfig.includes(key));

  // need to include invisible-because-unknown-before fields into result
  invisibleBecauseNotInConfig.forEach(fieldKey => {
    let insertAfterIndex: number = defaultKeysOrder.indexOf(fieldKey);
    while (insertAfterIndex > -1) {
      const fieldKeyAtIndex = defaultKeysOrder[ insertAfterIndex ];
      const currentIndex = result.indexOf(fieldKeyAtIndex);
      if (currentIndex !== -1) {
        result.splice(currentIndex + 1, 0, fieldKey);
        return;
      }
      insertAfterIndex--;
    }
    result.splice(0, 0, fieldKey);
  });

  return result;
}
