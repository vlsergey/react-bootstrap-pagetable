/**
* Structure of type is same as Spring Data Page type, thus server result
* can be pass to PageTable without transformation.
*/
interface Page<T> {
  content : T[];
  empty : boolean;
  first : boolean;
  hasContent : boolean;
  hasNext : boolean;
  hasPrevious : boolean;
  last : boolean;
  number : number;
  numberOfElements : number;
  size : number;
  totalElements : number;
  totalPages : number;
}

const EMPTY_PAGE_IMPL : Page<unknown> = Object.freeze( {
  content: [],
  empty: true,
  first: true,
  hasContent: false,
  hasNext: false,
  hasPrevious: false,
  last: true,
  number: 0,
  numberOfElements: 0,
  size: 0,
  totalElements: 0,
  totalPages: 0,
} );

export function emptyPage<T>() : Page<T> {
  return EMPTY_PAGE_IMPL as unknown as Page<T>;
}

export function singlePage<T>( items: T[] ) : Page<T> {
  return {
    content: items,
    empty: items.length === 0,
    first: true,
    hasContent: items.length !== 0,
    hasNext: false,
    hasPrevious: false,
    last: true,
    number: 0,
    numberOfElements: items.length,
    size: items.length,
    totalElements: items.length,
    totalPages: 1,
  };
}

export default Page;
