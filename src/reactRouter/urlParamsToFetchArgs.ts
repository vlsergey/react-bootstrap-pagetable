import FetchArgs, {Direction} from '../FetchArgs';
import FieldModel, {defaultFilterValueConverter, FilterValueConverter}
  from '../FieldModel';
import ItemModel from '../ItemModel';

export default function urlParamsToFetchArgs (
    defaultFetchArgs: FetchArgs,
    itemModel: ItemModel<unknown>,
    urlParamsPrefix: string,
    params: URLSearchParams
): FetchArgs {
  const prefix: string = urlParamsPrefix || '';

  const ifHave = (paramName: string, consumer: (paramValue: string) => unknown) => {
    const fullParamName: string = prefix + paramName;
    if (params.has(fullParamName)) {
      consumer(params.get(fullParamName));
    }
  };

  const result = {
    page: defaultFetchArgs.page,
    size: defaultFetchArgs.size,
    sort: defaultFetchArgs.sort,
  } as FetchArgs;
  ifHave('page', page => result.page = Number(page) - 1);
  ifHave('size', size => result.size = Number(size));

  if (params.has(prefix + 'sort')) {
    const resultSort = [];
    for (const sortValue of params.getAll(prefix + 'sort')) {
      let field: string = sortValue;
      let direction: Direction = 'ASC';

      const commaIndex: number = sortValue.indexOf(',');
      if (commaIndex !== -1) {
        field = sortValue.substring(0, commaIndex);
        direction = sortValue.substring(commaIndex).toUpperCase() === ',DESC' ? 'DESC' : 'ASC';
      }

      resultSort.push({field, direction});
    }
    result.sort = resultSort;
  }

  const defConverter: FilterValueConverter<unknown> = defaultFilterValueConverter();
  itemModel.fields.forEach(({filterValueConverter, key}: FieldModel<unknown, unknown>) =>
  { ifHave(key, filterStringValue => {
    if (!result.filter) {
      result.filter = {};
    }
    const converter: FilterValueConverter<unknown> = filterValueConverter || defConverter;
    result.filter[key] = converter.fromString(filterStringValue);
  }); }
  );
  return result;
}
