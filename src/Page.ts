/**
* Structure of type is same as Spring Data Page type, thus server result
* can be pass to PageTable without transformation.
*/
interface Page<T> {
  content : T[];
  /* The number of the current page. Is always non-negative. */
  number : number;
  totalElements : number;
  totalPages : number;
}

const EMPTY_PAGE_IMPL : Page<unknown> = Object.freeze( {
  content: [],
  number: 0,
  totalElements: 0,
  totalPages: 0,
} );

export function emptyPage<T>() : Page<T> {
  return EMPTY_PAGE_IMPL as unknown as Page<T>;
}

export function singlePage<T>( items: T[] ) : Page<T> {
  return {
    content: items,
    number: 0,
    totalElements: items.length,
    totalPages: 1,
  };
}

export default Page;
