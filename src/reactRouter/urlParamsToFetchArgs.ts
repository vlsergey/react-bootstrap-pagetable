import FetchArgs, {Direction} from '../FetchArgs';
import FieldModel, {defaultFilterValueConverter, FilterValueConverter}
  from '../FieldModel';
import ItemModel from '../ItemModel';

export default function urlParamsToFetchArgs<T> (
    defaultFetchArgs: FetchArgs,
    itemModel: ItemModel<T>,
    urlParamsPrefix: string | undefined,
    params: URLSearchParams
): FetchArgs {
  const prefix: string = urlParamsPrefix || '';

  const ifHaveSingle = (paramName: string, consumer: (paramValue: string) => unknown) => {
    const fullParamName: string = prefix + paramName;
    const paramValue = params.get(fullParamName);
    if (paramValue != null) {
      consumer(paramValue);
    }
  };

  const result = {
    page: defaultFetchArgs.page,
    size: defaultFetchArgs.size,
    sort: defaultFetchArgs.sort,
  } as FetchArgs;
  ifHaveSingle('page', page => result.page = Number(page) - 1);
  ifHaveSingle('size', size => result.size = Number(size));

  const ifHaveAll = (paramName: string, consumer: (paramValue: string[]) => unknown) => {
    const fullParamName: string = prefix + paramName;
    if (params.has(fullParamName)) {
      consumer(params.getAll(fullParamName));
    }
  };

  ifHaveAll('sort', sortParamValues => {
    result.sort = sortParamValues.map(sortValue => {
      let field: string = sortValue;
      let direction: Direction = 'ASC';

      const commaIndex: number = sortValue.indexOf(',');
      if (commaIndex !== -1) {
        field = sortValue.substring(0, commaIndex);
        direction = sortValue.substring(commaIndex).toUpperCase() === ',DESC' ? 'DESC' : 'ASC';
      }

      return {field, direction};
    });
  });

  const defConverter: FilterValueConverter<unknown> = defaultFilterValueConverter();
  itemModel.fields.forEach(({filterValueConverter, key}: FieldModel<T, unknown>) =>
  { ifHaveAll(key, (values: string[]) => {
    if (!result.filter) {
      result.filter = {};
    }
    const converter: FilterValueConverter<unknown> = filterValueConverter || defConverter;
    result.filter[key] = converter.fromStrings(values);
  }); });

  return result;
}
