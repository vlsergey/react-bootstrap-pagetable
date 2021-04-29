import { Direction, SortBy } from '../FetchArgs';
import FieldModel, { defaultGetter, FieldGetter } from '../FieldModel';
import ItemModel from '../ItemModel';

export default function localSort<T>(
    itemModel:ItemModel<T>,
    data : T[],
    sort?: SortBy[]
) : T[] {
  if ( !sort ) return data;

  const result : T[] = [ ...data ];

  const actualSortBy : SortBy[] = [ ...sort ];
  actualSortBy.reverse();

  actualSortBy.forEach( ( { field, direction } : SortBy ) => {
    const fieldModel = itemModel.fields.find( ( { key } ) => key === field );
    if ( !fieldModel ) throw Error( `Missing field ${field} model in item model` );
    inplaceSort( result, fieldModel, direction );
  } );

  return result;
}

function inplaceSort<T, V>( src: T[], fieldModel: FieldModel<V>, direction : Direction ) : void {
  const getter : FieldGetter<V> = fieldModel.getter || defaultGetter();

  const ascComparator : ( ( a:T, b:T ) => number ) = ( a:T, b :T ) => {
    const vA :V = getter( a, fieldModel );
    const vB :V = getter( b, fieldModel );

    if ( vA === undefined && vB === undefined ) return 0;
    if ( vA === undefined && vB !== undefined ) return +1; // A to the end
    if ( vA !== undefined && vB === undefined ) return -1; // B to the end

    if ( vA === null && vB === null ) return 0;
    if ( ( typeof vA === 'number' || vA === null ) && ( typeof vB === 'number' || vB === null ) ) {
      const nA : number = ( vA as unknown as number ) || 0;
      const nB : number = ( vB as unknown as number ) || 0;
      return nA === nB ? 0 : nA < nB ? -1 : +1;
    }

    const sA = String( vA );
    const sB = String( vB );
    return sA === sB ? 0 : sA < sB ? -1 : +1;
  };

  const comparator = direction === 'ASC'
    ? ascComparator
    : ( a:T, b:T ) => -ascComparator( a, b );

  src.sort( comparator );
}
