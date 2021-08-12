import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

import {ControlledBase, emptyPage, ItemModel} from '../src';
import ControlledPropsType from '../src/controlled/ControlledPropsType';
import withFetchArgsInState, {PropsType as WithFetchArgsInStatePropsType} from '../src/withFetchArgsInState';

type PageTableProps<T> = WithFetchArgsInStatePropsType<T, ControlledPropsType<T>>;

const NOOP = () => { /* NOOP */ };

describe('withFetchArgsInState', () => {
  const PageTable = withFetchArgsInState(ControlledBase) as
    (<T>(props: PageTableProps<T>) => JSX.Element);

  interface TestItem {id: string}
  const testItemModel = {
    idF: ({id}: TestItem) => id,
    fields: [{key: 'id', title: 'Id', sortable: true}]
  } as ItemModel<TestItem>;

  it('result can be used as JSX element', () => {
    renderIntoDocument(<PageTable
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      page={emptyPage<TestItem>()} />);
  });

  it('can specify onFetchArgsChange() property', () => {
    renderIntoDocument(<PageTable
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      onFetchArgsChange={NOOP}
      page={emptyPage<TestItem>()} />);
  });

  it('can specify default page/size/sort properties', () => {
    renderIntoDocument(<PageTable
      defaultPage={2}
      defaultSize={5}
      defaultSort="id,DESC"
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      onFetchArgsChange={NOOP}
      page={emptyPage<TestItem>()} />);
  });
});
