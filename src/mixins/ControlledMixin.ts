import {useMemo} from 'react';

import withActions, {PropsType as WithActionsPropsType} from '../actions/withActions';
import ControlledBase from '../controlled';
import ControlledPropsType from '../controlled/ControlledPropsType';
import withFilterable from '../filterable/withFilterable';
import withSelectable, {PropsType as WithSelectablePropsType} from '../selectable/withSelectable';
import withSortable from '../sortable';

type PlusControlledBaseProps<T> = ControlledPropsType<T>;
type PlusSelectableProps<T> = WithSelectablePropsType<T, PlusControlledBaseProps<T>>;
type PlusFilterableProps<T> = PlusSelectableProps<T>; // not changed
type PlusSortableProps<T> = PlusFilterableProps<T>; // not changed
type PlusActionsProps<T> = WithActionsPropsType<T, PlusSortableProps<T>>;

export type PropsType<T> = PlusActionsProps<T>;

export default function ControlledMixin<T> (props: PropsType<T>): JSX.Element {
  const mixin = useMemo(() => (props: PropsType<T>) =>
    withActions<T, PlusSortableProps<T>>(
      withSortable<T, PlusFilterableProps<T>>(
        withFilterable<T, PlusSelectableProps<T>>(
          withSelectable<T, PlusControlledBaseProps<T>>(
            ControlledBase
          ))))(props), []);

  return mixin(props);
}
