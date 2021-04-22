import * as UncontolledPageTableSpace from './UncontolledPageTable';
import Page, { emptyPage } from './Page';
import React, { PureComponent, ReactNode } from 'react';
import FetchArgs from './FetchArgs';
import UncontolledPageTable from './UncontolledPageTable';

export type PropsType<T> = Omit<UncontolledPageTableSpace.PropsType<T>,
  'error' | 'fetchArgs' | 'hasError' | 'loading' | 'page' | 'ref' > & {
  fetch: ( fetchArgs: FetchArgs ) => Promise<Page<T>>;
}

type StateType<T> = Pick<UncontolledPageTableSpace.PropsType<T>,
  'error' | 'fetchArgs' | 'hasError' | 'loading' | 'page' >;

export default class ContolledPageTable<T>
  extends PureComponent<PropsType<T>, StateType<T>> {

  state: StateType<T> = {
    error: null,
    fetchArgs: { page: 0, size: 0 },
    hasError: false,
    loading: true,
    page: emptyPage<T>(),
  }

  componentDidMount() : void {
    void this.refresh();
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

  render() : ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "fetch" }] */
    const { fetch, ...etcProps } = this.props;

    return <UncontolledPageTable {...etcProps} {...this.state} />;
  }

}
