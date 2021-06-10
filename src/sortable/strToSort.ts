import {SortBy} from '../FetchArgs';

export default function strToSort (str: string): SortBy {
  if (!str) return null;

  const commaIndex: number = str.indexOf(',');
  if (commaIndex === -1) {
    return {field: str, direction: 'ASC'};
  }
  const field: string = str.substring(0, commaIndex);
  const strDir: string = str.substring(commaIndex + 1);
  return {field, direction: strDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'};
}
