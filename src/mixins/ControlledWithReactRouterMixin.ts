import withReactRouter, {PropsType as WithReactRouterProps} from '../reactRouter/withReactRouter';
import ControlledMixin, {PropsType as ControlledMixinPropsType} from './ControlledMixin';

type PlusWithReactRouterProps<T> = WithReactRouterProps<T, ControlledMixinPropsType<T>>;

export type PropsType<T> = PlusWithReactRouterProps<T>;

export default withReactRouter(ControlledMixin) as
  unknown as (<T>(props: PropsType<T>) => JSX.Element);
