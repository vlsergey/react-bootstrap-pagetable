import FetchArgs from './FetchArgs';
import ItemModel from './ItemModel';
import localSort from './sortable/localSort';
import Page from './Page';

export default function fetchFromArray<T>(
    itemModel : ItemModel<T>,
    src: T[],
    { page, size, sort }: FetchArgs ) : Promise<Page<T>> {

  const toSkip : number = page * size;
  const sorted : T[] = localSort( itemModel, src, sort );
  const content : T[] = sorted.slice( toSkip, toSkip + size );

  return Promise.resolve( {
    content,
    number: page,
    numberOfElements: content.length,
    totalElements: src.length,
    totalPages: Math.ceil( src.length / size ),
  } as Page<T> );
}
