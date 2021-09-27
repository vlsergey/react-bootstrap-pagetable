import React, {PureComponent, ReactNode} from 'react';

import {NewComponentProps as WithActionsPropsType} from './actions/withActions';
import ControlledPropsType from './controlled/ControlledPropsType';
import FetchArgs from './FetchArgs';
import Page, {emptyPage} from './Page';

export type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'fetchArgs' | 'error' | 'hasError' | 'itemModel' | 'loading' | 'onFetchArgsChange' | 'page'> &
  Pick<WithActionsPropsType<T>, 'onRefreshRequired'>;

export interface NewComponentProps<T> {
  fetch: (fetchArgs: FetchArgs, fetchOptions: FetchOptions, reason: FetchReason) => Promise<Page<T>> | Page<T>;
}

export interface FetchOptions {
  signal?: AbortSignal;
}

export enum FetchReason {
  FIRST_TIME_FETCH,
  FETCH_ARGS_CHANGE,
  REFRESH_REQUIRED
}

type StateType<T> = Pick<ControlledPropsType<T>,
  'error' | 'hasError' | 'loading' | 'page' >;

export type PropsType<T, P extends RequiredChildComponentProps<T>> =
  Omit<P, 'error' | 'hasError' | 'loading' | 'onRefreshRequired' | 'page'> & NewComponentProps<T>;

const withPageInState = <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>): React.ComponentType<PropsType<T, P>> =>
  class WithPageInState extends PureComponent<PropsType<T, P>, StateType<T>> {

  prevFetchArgs?: FetchArgs = undefined;
  prevAbortController?: AbortController = undefined;

  override state: StateType<T> = {
    error: null,
    hasError: false,
    loading: true,
    page: emptyPage<T>(),
  };

  override componentDidMount (): void {
    void this.refresh(FetchReason.FIRST_TIME_FETCH);
  }

  override componentDidUpdate (prevProps: {fetchArgs: FetchArgs}) {
    if (this.props.fetchArgs !== prevProps.fetchArgs) {
      this.scheduleRefreshNow(FetchReason.FETCH_ARGS_CHANGE);
    }
  }

  handleRefreshRequired = (): void => {
    this.scheduleRefreshNow(FetchReason.REFRESH_REQUIRED);
  };

  refresh = async (fetchReason: FetchReason): Promise<void> => {
    const {fetch, fetchArgs} = this.props;
    if (fetchArgs === this.prevFetchArgs && fetchReason !== FetchReason.REFRESH_REQUIRED) {
      return;
    }

    try {
      if (fetch === undefined)
        throw new Error('fetch() implementation was not provided to PageTable. ' +
          'Check PageTable properties or switch to Controllable variant of PageTable');

      this.setState({loading: true});

      if (this.prevAbortController != undefined) {
        this.prevAbortController.abort();
        this.prevAbortController = undefined;
      }

      // do not use fetch result from outdated query

      // remember query here...
      this.prevFetchArgs = fetchArgs;
      const newAbortController = this.prevAbortController = window.AbortController ? new AbortController() : undefined;

      const fetchOptions: FetchOptions = newAbortController != undefined ? {signal: newAbortController.signal} : {};
      const page: Page<T> = await fetch(fetchArgs, fetchOptions, fetchReason);

      // ...to compare query here
      if (this.prevFetchArgs === fetchArgs) {
        this.setState({error: undefined, loading: false, hasError: false, page});
        this.prevAbortController = undefined;
      }

    } catch (error: unknown) {
      this.setState({error, loading: false, hasError: true});
    }
  };

  scheduleRefreshNow = (reason: FetchReason): unknown =>
    setTimeout((): void => void this.refresh(reason), 0);

  override render (): ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "fetch|onFetchArgsChange" }] */
    const {fetch, ...etcProps} = this.props;

    return <Child
      onRefreshRequired={this.handleRefreshRequired}
      {...(etcProps as unknown as P)}
      {...this.state} />;
  }

  };

export default withPageInState;
