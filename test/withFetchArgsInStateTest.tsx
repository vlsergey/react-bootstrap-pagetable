import {ControlledBase, emptyPage, ItemModel, withFetchArgsInState} from '../src';
import React from 'react';
import {renderIntoDocument} from 'react-dom/test-utils';

const NOOP = () => { /* NOOP */ };

describe('withFetchArgsInState', () => {
  const PageTable = withFetchArgsInState(ControlledBase);
  type TestItem = {id: string};
  const testItemModel = {
    idF: ({id}: TestItem) => id,
    fields: [ {key: 'id', title: 'Id', sortable: true} ]
  } as ItemModel<TestItem>;

  it('result can be used as JSX element', () => {
    renderIntoDocument(<PageTable
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      page={emptyPage()} />);
  });

  it('can specify onFetchArgsChange() property', () => {
    renderIntoDocument(<PageTable
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      onFetchArgsChange={NOOP}
      page={emptyPage()} />);
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
      page={emptyPage()} />);
  });
});
