import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

import {ControlledBase, emptyPage, ItemModel} from '../src';
import ControlledPropsType from '../src/controlled/ControlledPropsType';
import withSelectable, {PropsType as WithSelectablePropsType} from '../src/selectable/withSelectable';

type PageTableProps<T> = WithSelectablePropsType<T, ControlledPropsType<T>>;

const NOOP = () => { /* NOOP */ };

describe('withSelectable', () => {
  it('result can be used as JSX element', () => {
    const PageTable = withSelectable(ControlledBase) as
      (<T>(props: PageTableProps<T>) => JSX.Element);

    interface TestItem {id: string}

    const testItemModel = {
      idF: ({id}: TestItem) => id,
      fields: [{key: 'id', title: 'Id', sortable: true}]
    } as ItemModel<TestItem>;

    renderIntoDocument(<PageTable
      fetchArgs={{page: 0, size: 10}}
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      onFetchArgsChange={NOOP}
      onSelectedIdsChange={NOOP}
      page={emptyPage<TestItem>()}
      selectable
      selectedIds={[]} />);
  });
});
