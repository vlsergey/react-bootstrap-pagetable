import FieldModel, { defaultGetter } from './FieldModel';
import FetchArgs from './FetchArgs';
import ItemModel from './ItemModel';
import localSort from './sortable/localSort';
import Page from './Page';

export default function fetchFromArray<T>(
    itemModel : ItemModel<T>,
    src: T[],
    { page, filter, size, sort }: FetchArgs ) : Promise<Page<T>> {

  const filtered : T[] = !filter ? src : src.filter( ( item : T ) =>
    Object.keys( filter ).every( ( fieldKey : string ) => {
      const filterBy : unknown = filter[ fieldKey ];
      if ( typeof filterBy !== 'string' ) return false;

      const field : FieldModel<unknown> = itemModel.fields.find( ( { key } ) => key == fieldKey );
      if ( !field ) return false;

      const itemValue : unknown = ( field.getter || defaultGetter() )( item, field );
      if ( typeof itemValue !== 'string' ) return false;

      return itemValue.toLowerCase().includes( filterBy.toLowerCase() );
    } )
  );

  const toSkip : number = page * size;
  const sorted : T[] = localSort( itemModel, filtered, sort );
  const content : T[] = sorted.slice( toSkip, toSkip + size );

  return Promise.resolve( {
    content,
    number: page,
    numberOfElements: content.length,
    totalElements: src.length,
    totalPages: Math.ceil( src.length / size ),
  } as Page<T> );
}
