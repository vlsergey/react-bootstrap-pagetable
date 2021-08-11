import {useMemo} from 'react';

import withReactRouter, {PropsType as WithReactRouterProps} from '../reactRouter/withReactRouter';
import withPageInState, {PropsType as WithPageInStateProps} from '../withPageInState';
import ControlledMixin, {PropsType as ControlledMixinPropsType} from './ControlledMixin';

type PlusWithPageInStateProps<T> = WithPageInStateProps<T, ControlledMixinPropsType<T>>;
type PlusWithReactRouterProps<T> = WithReactRouterProps<T, PlusWithPageInStateProps<T>>;

export type PropsType<T> = PlusWithReactRouterProps<T>;

export default function UncontrolledWithReactRouterMixin<T> (props: PropsType<T>): JSX.Element {
  const mixin = useMemo(() => (props: PropsType<T>) =>
    withReactRouter<T, PlusWithPageInStateProps<T>>(
      withPageInState<T, ControlledMixinPropsType<T>>(
        ControlledMixin
      ))(props), []);

  return mixin(props);
}
