import React, { PureComponent, ReactNode } from 'react';
import { PropsType as ControlledPropsType } from './ControlledBase';
import FetchArgs from './FetchArgs';

export type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'fetchArgs' | 'onFetchArgsChange'>;

type StateType<T> = Pick<ControlledPropsType<T>, 'fetchArgs'>;

export interface NewComponentProps<T> {
  // now optional
  onFetchArgsChange?: ControlledPropsType<T>['onFetchArgsChange'];
}

const withFetchArgsInState = <T, P extends RequiredChildComponentProps<T>>( Child : React.ComponentType<P> ) :
  React.ComponentType<NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>> =>
    class WithFetchArgsInState extends PureComponent<NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>, StateType<T>> {

  state: StateType<T> = {
    fetchArgs: { page: 0, size: 10 },
  }

  handleFetchArgsChange = ( fetchArgs: FetchArgs ) : void => {
    const { onFetchArgsChange } = this.props;
    this.setState( { fetchArgs } );
    if ( onFetchArgsChange ) {
      onFetchArgsChange( fetchArgs );
    }
  }

  render() : ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "onFetchArgsChange" }] */
    const { onFetchArgsChange, ...etcProps } = this.props;

    return <Child
      onFetchArgsChange={this.handleFetchArgsChange}
      {...etcProps as P}
      {...this.state} />;
  }

    };

export default withFetchArgsInState;
