import Page, { emptyPage } from './Page';
import React, { PureComponent, ReactNode } from 'react';
import { PropsType as ControlledPropsType } from './ControlledBase';
import FetchArgs from './FetchArgs';
import { NewComponentProps as WithActionsPropsType } from './actions';

export type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'fetchArgs' | 'error' | 'hasError' | 'itemModel' | 'loading' | 'onFetchArgsChange' | 'page'> &
  Pick<WithActionsPropsType<T>, 'onRefreshRequired'>;

export interface NewComponentProps<T> {
  fetch: ( fetchArgs: FetchArgs, fetchOptions: FetchOptions ) => Promise<Page<T>> | Page<T>;
}

export interface FetchOptions {
  signal?: AbortSignal;
}

type StateType<T> = Pick<ControlledPropsType<T>,
  'error' | 'hasError' | 'loading' | 'page' >;

type PropsType<T, P extends RequiredChildComponentProps<T>> =
  Omit<P, 'error' | 'hasError' | 'loading' | 'onRefreshRequired' | 'page'> & NewComponentProps<T>;

const withPageInState = <T, P extends RequiredChildComponentProps<T>>( Child : React.ComponentType<P> ) : React.ComponentType<PropsType<T, P>> =>
  class WithPageInState extends PureComponent<PropsType<T, P>, StateType<T>> {

  prevFetchArgs : FetchArgs = null;
  prevAbortController : AbortController = null;

  state: StateType<T> = {
    error: null,
    hasError: false,
    loading: true,
    page: emptyPage<T>(),
  }

  componentDidMount() : void {
    void this.refresh();
  }

  componentDidUpdate( prevProps : { fetchArgs: FetchArgs } ) {
    if ( this.props.fetchArgs !== prevProps.fetchArgs ) {
      this.scheduleRefreshNow();
    }
  }

  handleRefreshRequired = () : void => {
    this.scheduleRefreshNow();
  }

  refresh = async() : Promise<void> => {
    const { fetch, fetchArgs } = this.props;
    if ( fetchArgs === this.prevFetchArgs ) {
      return;
    }

    try {
      if ( fetch === undefined )
        throw new Error( 'fetch() implementation was not provided to PageTable. ' +
          'Check PageTable properties or switch to Controllable variant of PageTable' );

      this.setState( { loading: true } );

      if ( this.prevAbortController != null ) {
        this.prevAbortController.abort();
        this.prevAbortController = null;
      }

      // do not use fetch result from outdated query

      // remember query here...
      this.prevFetchArgs = fetchArgs;
      const newAbortController = this.prevAbortController = window.AbortController ? new AbortController() : null;

      const fetchOptions : FetchOptions = newAbortController != null ? { signal: newAbortController.signal } : {};
      const page : Page<T> = await fetch( fetchArgs, fetchOptions );

      // ...to compare query here
      if ( this.prevFetchArgs === fetchArgs ) {
        this.setState( { error: null, loading: false, hasError: false, page } );
        this.prevFetchArgs = null;
        this.prevAbortController = null;
      }

    } catch ( error : unknown ) {
      this.setState( { error, loading: false, hasError: true } );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  scheduleRefreshNow = () : unknown => setTimeout( this.refresh, 0 );

  render() : ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "fetch|onFetchArgsChange" }] */
    const { fetch, ...etcProps } = this.props;

    return <Child
      onRefreshRequired={this.handleRefreshRequired}
      {...( etcProps as unknown as P )}
      {...this.state} />;
  }

  };

export default withPageInState;
