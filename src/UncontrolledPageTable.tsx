import Page, { emptyPage } from './Page';
import React, { PureComponent, ReactNode } from 'react';
import WithActionsPageTable, * as WithActionsPageTableSpace from './actions/WithActionsPageTable';
import FetchArgs from './FetchArgs';

export type PropsType<T> = Omit<WithActionsPageTableSpace.PropsType<T>,
  'error' | 'fetchArgs' | 'hasError' | 'loading' | 'onFetchArgsChange' | 'onRefreshRequired' | 'page' | 'ref' > & {
  fetch: ( fetchArgs: FetchArgs ) => Promise<Page<T>>;
}

type StateType<T> = Pick<WithActionsPageTableSpace.PropsType<T>,
  'error' | 'fetchArgs' | 'hasError' | 'loading' | 'page' >;

export default class ControlledPageTable<T>
  extends PureComponent<PropsType<T>, StateType<T>> {

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
    this.setState( { fetchArgs } );
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
      const page : Page<T> = await fetch( fetchArgs );
      this.setState( { error: null, loading: false, hasError: false, page } );
    } catch ( error : unknown ) {
      this.setState( { error, loading: false, hasError: true } );
    }
  } ;

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  scheduleRefreshNow = () : unknown => setTimeout( this.refresh, 0 );

  render() : ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "fetch" }] */
    const { fetch, ...etcProps } = this.props;

    return <WithActionsPageTable
      onFetchArgsChange={this.handleFetchArgsChange}
      onRefreshRequired={this.handleRefreshRequired}
      {...etcProps}
      {...this.state} />;
  }

}
