import {useMemo} from 'react';

import withReactRouter, {PropsType as WithReactRouterProps} from '../reactRouter/withReactRouter';
import ControlledMixin, {PropsType as ControlledMixinPropsType} from './ControlledMixin';

type PlusWithReactRouterProps<T> = WithReactRouterProps<T, ControlledMixinPropsType<T>>;

export type PropsType<T> = PlusWithReactRouterProps<T>;

export default function ControlledWithReactRouterMixin<T> (props: PropsType<T>): JSX.Element {
  const mixin = useMemo(() => (props: PropsType<T>) =>
    withReactRouter<T, ControlledMixinPropsType<T>>(
      ControlledMixin
    )(props), []);

  return mixin(props);
}
