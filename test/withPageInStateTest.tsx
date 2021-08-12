import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

import {ControlledBase, emptyPage, ItemModel} from '../src';
import withActions, {PropsType as WithActionsPropsType} from '../src/actions/withActions';
import ControlledPropsType from '../src/controlled/ControlledPropsType';
import withSelectable, {PropsType as WithSelectablePropsType} from '../src/selectable/withSelectable';
import withPageInState, {PropsType as WithPageInStatePropsType} from '../src/withPageInState';

const NOOP = () => { /* NOOP */ };

type PageTableProps<T> = WithPageInStatePropsType<T, WithActionsPropsType<T,
    WithSelectablePropsType<T, ControlledPropsType<T>>>>;

describe('withPageInState', () => {
  it('result can be used as JSX element', () => {
    const PageTable = withPageInState(withActions(withSelectable(ControlledBase))) as
      unknown as (<T>(props: PageTableProps<T>) => JSX.Element);

    interface TestItem {id: string}

    const testItemModel = {
      idF: ({id}: TestItem) => id,
      fields: [{key: 'id', title: 'Id', sortable: true}]
    } as ItemModel<TestItem>;

    renderIntoDocument(<PageTable<TestItem>
      fetch={() => Promise.resolve(emptyPage<TestItem>())}
      fetchArgs={{page: 0, size: 10}}
      itemModel={testItemModel}
      onFetchArgsChange={NOOP} />);
  });
});
