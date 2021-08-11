import {SortBy} from '../FetchArgs';

export default function strToSort (str?: (string | string[])): undefined | SortBy[] {
  if (!str) return undefined;

  if (typeof str === 'string') {
    const sortBy = strToSortBy(str);
    if (!sortBy) return undefined;
    return [sortBy];
  }

  const strAsArray = str;
  const resultArray = strAsArray.map(strToSortBy).filter(x => !!x) as SortBy[];
  return !resultArray ? undefined : resultArray;
}

function strToSortBy (str?: string): SortBy | undefined {
  if (!str) return undefined;

  const commaIndex: number = str.indexOf(',');
  if (commaIndex === -1) {
    return {field: str, direction: 'ASC'};
  }
  const field: string = str.substring(0, commaIndex);
  const strDir: string = str.substring(commaIndex + 1);
  return {field, direction: strDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'};
}
