import withFetchArgsInState, {PropsType as WithFetchArgsInStateProps} from '../withFetchArgsInState';
import withPageInState, {PropsType as WithPageInStateProps} from '../withPageInState';
import ControlledMixin, {PropsType as ControlledMixinPropsType} from './ControlledMixin';

type PlusWithPageInStateProps<T> = WithPageInStateProps<T, ControlledMixinPropsType<T>>;
type PlusWithFetchArgsInStateNewComponentProps<T> = WithFetchArgsInStateProps<T, PlusWithPageInStateProps<T>>;

export type PropsType<T> = PlusWithFetchArgsInStateNewComponentProps<T>;

export default withFetchArgsInState(withPageInState(ControlledMixin)) as
  unknown as (<T>(props: PropsType<T>) => JSX.Element);
