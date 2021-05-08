import InnerPageTable, * as InnerPageTableSpace from './sortable';
import Page, { emptyPage } from './Page';
import React, { PureComponent, ReactNode } from 'react';
import FetchArgs from './FetchArgs';

export interface FetchOptions {
  signal?: AbortSignal;
}

export type PropsType<T> = Omit<InnerPageTableSpace.PropsType<T>,
  'error' | 'fetchArgs' | 'hasError' | 'loading' | 'onFetchArgsChange' | 'onRefreshRequired' | 'page' | 'ref' > & {
  fetch: ( fetchArgs: FetchArgs, fetchOptions: FetchOptions ) => Promise<Page<T>>;
  onFetchArgsChange? : InnerPageTableSpace.PropsType<T>['onFetchArgsChange'];
}

type StateType<T> = Pick<InnerPageTableSpace.PropsType<T>,
  'error' | 'fetchArgs' | 'hasError' | 'loading' | 'page' >;

export default class UncontrolledPageTable<T>
  extends PureComponent<PropsType<T>, StateType<T>> {

  private prevFetchArgs : FetchArgs = null;
  private prevAbortController : AbortController = null;

  state: StateType<T> = {
    error: null,
    fetchArgs: { page: 0, size: 10 },
    hasError: false,
    loading: true,
    page: emptyPage<T>(),
  }

  componentDidMount() : void {
    void this.refresh();
  }

  handleFetchArgsChange = ( fetchArgs: FetchArgs ) : void => {
    const { onFetchArgsChange } = this.props;
    this.setState( { fetchArgs } );
    if ( onFetchArgsChange ) {
      onFetchArgsChange( fetchArgs );
    }
    // add bounce?
    this.scheduleRefreshNow();
  }

  handleRefreshRequired = () : void => {
    this.scheduleRefreshNow();
  }

  refresh = async() : Promise<void> => {
    const { fetch } = this.props;
    const { fetchArgs } = this.state;

    try {
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
    const { fetch, onFetchArgsChange, ...etcProps } = this.props;

    return <InnerPageTable
      onFetchArgsChange={this.handleFetchArgsChange}
      onRefreshRequired={this.handleRefreshRequired}
      {...etcProps}
      {...this.state} />;
  }

}
