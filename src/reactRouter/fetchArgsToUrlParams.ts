import FetchArgs, {SortBy} from '../FetchArgs';
import FieldModel, {defaultFilterValueConverter, FilterValueConverter}
  from '../FieldModel';
import ItemModel from '../ItemModel';

export default function fetchArgsToUrlParams (
    itemModel: ItemModel<unknown>,
    urlParamsPrefix: string,
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

  itemModel.fields.forEach(({filterValueConverter, key}: FieldModel<unknown, unknown>) => {
    const filterValue = (fetchArgs.filter || {})[key];
    if (filterValue !== undefined) {
      const converter: FilterValueConverter<unknown> = filterValueConverter || defaultFilterValueConverter();
      params.set(prefix + key, converter.toString(filterValue));
    } else {
      params.delete(prefix + key);
    }
  });
  return params;
}
