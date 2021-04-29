import FetchArgs from './FetchArgs';
import Page from './Page';
import springDataRestResponseToPage from './springDataRestResponseToPage';

const FETCH_PARAMS = {
  method: 'GET',
  headers: {
    Accept: 'application/json',
  },
};

export default async function fetchFromSpringDataRest<T>(
    url : string,
    { page, size, sort } : FetchArgs,
    responseCollectionKey : string ) : Promise<Page<T>> {

  const args : URLSearchParams = new URLSearchParams();
  args.append( 'page', String( page ) );
  args.append( 'size', String( size ) );

  const firstSort = sort ? sort[ sort.length - 1 ] : null;
  if ( firstSort ) {
    args.append( 'sort', firstSort.field + ( firstSort.direction === 'DESC' ? ',desc' : '' ) );
  }

  const response : Response = await fetch( `${url}?${args.toString()}`, FETCH_PARAMS );

  if ( !response.ok ) {
    console.trace( response );
    throw new Error( 'Spring Data REST error: ' + response.statusText );
  }

  const json : unknown = await response.json();

  const result : Page<T> = springDataRestResponseToPage<T>( responseCollectionKey,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    json as any );
  return result;
}
