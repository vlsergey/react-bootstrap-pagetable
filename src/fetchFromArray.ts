import FetchArgs from './FetchArgs';
import FieldModel, {defaultGetter} from './FieldModel';
import ItemModel from './ItemModel';
import Page from './Page';
import localSort from './sortable/localSort';

export const DEFAULT_PAGE = 0;
export const DEFAULT_SIZE = 10;

export default function fetchFromArray<T> (
    itemModel: ItemModel<T>,
    src: T[],
    {page, filter, size, sort}: FetchArgs): Page<T> {

  const filtered: T[] = !filter ? src : src.filter((item: T) =>
    Object.keys(filter).every((fieldKey: string) => {
      const filterBy: unknown = filter[fieldKey];
      if (typeof filterBy !== 'string') return false;

      const field: FieldModel<T, unknown> = itemModel.fields.find(({key}) => key == fieldKey);
      if (!field) return false;

      const itemValue: unknown = (field.getter || defaultGetter)(item, field, itemModel);
      if (typeof itemValue !== 'string') return false;

      return itemValue.toLowerCase().includes(filterBy.toLowerCase());
    })
  );

  const actualPage: number = page === null || page === undefined ? DEFAULT_PAGE : page;
  const actualSize: number = size === null || size === undefined ? DEFAULT_SIZE : size;

  const toSkip: number = actualPage * actualSize;
  const sorted: T[] = localSort(itemModel, filtered, sort);
  const content: T[] = sorted.slice(toSkip, toSkip + actualSize);

  return {
    content,
    number: actualPage,
    numberOfElements: content.length,
    totalElements: src.length,
    totalPages: Math.ceil(src.length / actualSize),
  } as Page<T>;
}
