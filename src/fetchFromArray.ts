import FetchArgs from './FetchArgs';
import Page from './Page';

export default function fetchFromArray<T>( src: T[], { page, size }: FetchArgs ) : Promise<Page<T>> {

  const toSkip = page * size;
  const content: T[] = src.slice( toSkip, toSkip + size );

  return Promise.resolve( {
    content,
    empty: content.length === 0,
    first: toSkip === 0,
    hasContent: content.length !== 0,
    hasNext: ( toSkip + size ) < src.length,
    hasPrevious: toSkip > 0,
    last: ( toSkip + size ) < src.length,
    number: page,
    numberOfElements: content.length,
    size: content.length,
    totalElements: src.length,
    totalPages: Math.ceil( src.length / size ),
  } as Page<T> );
}
