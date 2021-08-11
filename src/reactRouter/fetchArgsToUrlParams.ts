import FetchArgs, {SortBy} from '../FetchArgs';
import FieldModel, {defaultFilterValueConverter, FilterValueConverter}
  from '../FieldModel';
import ItemModel from '../ItemModel';

export default function fetchArgsToUrlParams<T> (
    itemModel: ItemModel<T>,
    urlParamsPrefix: string | undefined,
    currentSearch: ConstructorParameters<typeof URLSearchParams>[0],
    fetchArgs: FetchArgs
): URLSearchParams {
  const prefix = urlParamsPrefix || '';
  const params = new URLSearchParams(currentSearch);

  params.set(`${prefix}page`, String(fetchArgs.page + 1));
  params.set(`${prefix}size`, String(fetchArgs.size));

  if (fetchArgs.sort) {
    params.set(`${prefix}sort`, fetchArgs.sort
      .map(({field, direction}: SortBy) => `${field}${direction === 'DESC' ? ',DESC' : ''}`)
      .join(''));
  } else {
    params.delete(`${prefix}sort`);
  }

  itemModel.fields.forEach(({filterValueConverter, key}: FieldModel<T, unknown>) => {
    params.delete(prefix + key);

    const filterValue = (fetchArgs.filter || {})[key];
    if (filterValue !== undefined) {
      const converter: FilterValueConverter<unknown> = filterValueConverter || defaultFilterValueConverter();
      for (const value of converter.toStrings(filterValue))
        params.append(prefix + key, value);
    }
  });
  return params;
}
