import FieldModel, { defaultFilterValueConverter, FieldFilterValueConverter }
  from './FieldModel';
import React, { PureComponent, ReactNode } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import FetchArgs from './FetchArgs';
import ItemModel from './ItemModel';
import memoizeOne from 'memoize-one';

function toFetchArgsImpl(
    itemModel : ItemModel<unknown>, urlParamsPrefix : string, search : string
) : FetchArgs {
  if ( !search ) {
    return {};
  }

  const params : URLSearchParams = new URLSearchParams( search );
  const prefix : string = urlParamsPrefix || '';

  const result = {} as FetchArgs;
  if ( params.has( prefix + 'page' ) ) {
    result.page = Number( params.get( prefix + 'page' ) );
  }
  if ( params.has( prefix + 'size' ) ) {
    result.size = Number( params.get( prefix + 'size' ) );
  }
  itemModel.fields.forEach( ( { filterValueConverter, key } : FieldModel<unknown> ) => {
    if ( params.has( prefix + key ) ) {
      const filterStringValue = params.get( prefix + key );
      if ( !result.filter ) {
        result.filter = {};
      }
      const converter : FieldFilterValueConverter<unknown> = filterValueConverter || defaultFilterValueConverter();
      result.filter[ key ] = converter.fromString( filterStringValue );
    }
  } );
  return result;
}

export type RequiredChildComponentProps<T> = {
  fetchArgs: FetchArgs;
  itemModel: ItemModel<T>;
  onFetchArgsChange: ( fetchArgs : FetchArgs ) => unknown;
}

export type NewComponentProps = {
  urlParamsPrefix? : string,
}

type InnerComponentProps<T, P extends RequiredChildComponentProps<T>>
  = RouteComponentProps<unknown> & NewComponentProps & Omit<P, 'fetchArgs'>;

const withReactRouterImpl =
  <T, P extends RequiredChildComponentProps<T>>( Child: React.ComponentType<P> ) : React.ComponentType<InnerComponentProps<T, P>> =>
    class RoutedPageTable extends PureComponent<InnerComponentProps<T, P>> {

  toFetchArgs = memoizeOne( toFetchArgsImpl );

  handleFetchArgsChange = ( fetchArgs: FetchArgs ) : void => {
    const { history, itemModel, location, onFetchArgsChange,
      urlParamsPrefix } = this.props;

    const prefix = urlParamsPrefix || '';
    const params = new URLSearchParams( location.search );

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

    itemModel.fields.forEach( ( { filterValueConverter, key }: FieldModel<unknown> ) => {
      const filterValue = ( fetchArgs.filter || {} )[ key ];
      if ( filterValue !== null && filterValue !== undefined ) {
        const converter : FieldFilterValueConverter<unknown> = filterValueConverter || defaultFilterValueConverter();
        params.set( prefix + key, converter.toString( filterValue ) );
      } else {
        params.delete( prefix + key );
      }
    } );
    const newSearch : string = params.toString();

    if ( onFetchArgsChange ) {
      onFetchArgsChange( toFetchArgsImpl( itemModel, urlParamsPrefix, newSearch ) );
    }

    history.replace( `${location.pathname}?${newSearch}` );
  }

  render() : ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "history|match|onFetchArgsChange" }] */
    const { itemModel, history, location, match, onFetchArgsChange,
      urlParamsPrefix, ...etcProps } = this.props;
    return <Child
      fetchArgs={this.toFetchArgs( itemModel, urlParamsPrefix, location.search )}
      itemModel={itemModel}
      onFetchArgsChange={this.handleFetchArgsChange}
      {...etcProps as unknown as P} />;
  }
    };

const withReactRouter =
  <T, P extends RequiredChildComponentProps<T>>( Child: React.ComponentType<P> ) : React.ComponentType<NewComponentProps & Omit<P, 'fetchArgs'>> =>
    withRouter( withReactRouterImpl( Child ) ) as unknown as React.ComponentType<NewComponentProps & Omit<P, 'fetchArgs'>>;

export default withReactRouter;
