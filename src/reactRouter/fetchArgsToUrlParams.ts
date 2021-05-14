import FetchArgs, { SortBy } from '../FetchArgs';
import FieldModel, { defaultFilterValueConverter, FieldFilterValueConverter }
  from '../FieldModel';
import ItemModel from '../ItemModel';
import { Location } from 'history';

export default function fetchArgsToUrlParams(
    itemModel: ItemModel<unknown>,
    urlParamsPrefix : string,
    current : Location,
    fetchArgs : FetchArgs
) : URLSearchParams {
  const prefix = urlParamsPrefix || '';
  const params = new URLSearchParams( current.search );

  if ( fetchArgs.page ) {
    params.set( `${prefix}page`, String( fetchArgs.page ) );
  } else {
    params.delete( `${prefix}page` );
  }
  if ( fetchArgs.size ) {
    params.set( `${prefix}size`, String( fetchArgs.size ) );
  } else {
    params.delete( `${prefix}size` );
  }
  if ( fetchArgs.sort ) {
    params.set( `${prefix}sort`, fetchArgs.sort
      .map( ( { field, direction }: SortBy ) => `${field}${direction === 'DESC' ? ',DESC' : ''}` )
      .join( '' ) );
  } else {
    params.delete( `${prefix}sort` );
  }

  itemModel.fields.forEach( ( { filterValueConverter, key }: FieldModel<unknown> ) => {
    const filterValue = ( fetchArgs.filter || {} )[ key ];
    if ( filterValue !== null && filterValue !== undefined ) {
      const converter : FieldFilterValueConverter<unknown> = filterValueConverter || defaultFilterValueConverter();
      params.set( prefix + key, converter.toString( filterValue ) );
    } else {
      params.delete( prefix + key );
    }
  } );
  return params;
}
