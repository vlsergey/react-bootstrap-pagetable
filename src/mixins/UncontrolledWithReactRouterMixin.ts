import withReactRouter, {PropsType as WithReactRouterProps} from '../reactRouter/withReactRouter';
import withPageInState, {PropsType as WithPageInStateProps} from '../withPageInState';
import ControlledMixin, {PropsType as ControlledMixinPropsType} from './ControlledMixin';

type PlusWithPageInStateProps<T> = WithPageInStateProps<T, ControlledMixinPropsType<T>>;
type PlusWithReactRouterProps<T> = WithReactRouterProps<T, PlusWithPageInStateProps<T>>;

export type PropsType<T> = PlusWithReactRouterProps<T>;

export default withReactRouter(withPageInState(ControlledMixin)) as
  unknown as (<T>(props: PropsType<T>) => JSX.Element);
