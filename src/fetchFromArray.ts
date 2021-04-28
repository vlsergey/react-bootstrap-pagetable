import FetchArgs from './FetchArgs';
import Page from './Page';

export default function fetchFromArray<T>( src: T[], { page, size }: FetchArgs ) : Promise<Page<T>> {

  const toSkip : number = page * size;
  const content : T[] = src.slice( toSkip, toSkip + size );

  return Promise.resolve( {
    content,
    number: page,
    numberOfElements: content.length,
    totalElements: src.length,
    totalPages: Math.ceil( src.length / size ),
  } as Page<T> );
}
