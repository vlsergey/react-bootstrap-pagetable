import {SortBy} from '../FetchArgs';

export default function strToSort (str: (string | string[])): SortBy[] {
  if (!str) return null;

  if (typeof str === 'string') {
    const sortBy: SortBy = strToSortBy(str);
    if (!sortBy) return null;
    return [sortBy];
  }

  const strAsArray = str;
  const resultArray: SortBy[] = strAsArray.map(strToSortBy).filter(x => !!x);
  return !resultArray ? null : resultArray;
}

function strToSortBy (str: string): SortBy {
  if (!str) return null;

  const commaIndex: number = str.indexOf(',');
  if (commaIndex === -1) {
    return {field: str, direction: 'ASC'};
  }
  const field: string = str.substring(0, commaIndex);
  const strDir: string = str.substring(commaIndex + 1);
  return {field, direction: strDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'};
}
