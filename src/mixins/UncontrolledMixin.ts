import {useMemo} from 'react';

import withFetchArgsInState, {PropsType as WithFetchArgsInStateProps} from '../withFetchArgsInState';
import withPageInState, {PropsType as WithPageInStateProps} from '../withPageInState';
import ControlledMixin, {PropsType as ControlledMixinPropsType} from './ControlledMixin';

type PlusWithPageInStateProps<T> = WithPageInStateProps<T, ControlledMixinPropsType<T>>;
type PlusWithFetchArgsInStateNewComponentProps<T> = WithFetchArgsInStateProps<T, PlusWithPageInStateProps<T>>;

export type PropsType<T> = PlusWithFetchArgsInStateNewComponentProps<T>;

export default function UncontrolledMixin<T> (props: PropsType<T>): JSX.Element {
  const mixin = useMemo(() => (props: PropsType<T>) =>
    withFetchArgsInState<T, PlusWithPageInStateProps<T>>(
      withPageInState<T, ControlledMixinPropsType<T>>(
        ControlledMixin
      ))(props), []);

  return mixin(props);
}
