import React, {PureComponent, ReactNode} from 'react';
import {PropsType as ControlledPropsType} from './controlled';
import FetchArgs from './FetchArgs';

export type RequiredChildComponentProps<T> =
  Pick<ControlledPropsType<T>, 'fetchArgs' | 'onFetchArgsChange'>;

type StateType<T> = Pick<ControlledPropsType<T>, 'fetchArgs'>;

export interface NewComponentProps<T> {
  defaultPage?: number;
  defaultSize?: number;
  // now optional
  onFetchArgsChange?: ControlledPropsType<T>['onFetchArgsChange'];
}

type PropsType<T, P extends RequiredChildComponentProps<T>> =
  NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>;

const withFetchArgsInState = <T, P extends RequiredChildComponentProps<T>>(Child: React.ComponentType<P>):
  React.ComponentType<NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>> =>
    class WithFetchArgsInState extends PureComponent<PropsType<T, P>, StateType<T>> {

  static defaultProps = {
    ...Child.defaultProps,
    defaultPage: 0,
    defaultSize: 10,
  } as Partial<NewComponentProps<T> & Omit<P, 'fetchArgs' | 'onFetchArgsChange'>>;

  constructor (props: PropsType<T, P>) {
    super(props);

    this.state = {
      fetchArgs: {
        page: props.defaultPage,
        size: props.defaultSize,
      }
    };
  }

  handleFetchArgsChange = (fetchArgs: FetchArgs): void => {
    const {onFetchArgsChange} = this.props;
    this.setState({fetchArgs});
    if (onFetchArgsChange) {
      onFetchArgsChange(fetchArgs);
    }
  };

  override render (): ReactNode {
    /* eslint @typescript-eslint/no-unused-vars: ["error", { "varsIgnorePattern": "defaultPage|defaultSize|onFetchArgsChange" }] */
    const {onFetchArgsChange, defaultPage, defaultSize, ...etcProps} = this.props;

    return <Child
      onFetchArgsChange={this.handleFetchArgsChange}
      {...etcProps as unknown as P}
      {...this.state} />;
  }

    };

export default withFetchArgsInState;
