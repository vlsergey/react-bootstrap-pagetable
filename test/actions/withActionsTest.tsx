import {assert} from 'chai';
import React, {Component} from 'react';
import {findRenderedDOMComponentWithTag, renderIntoDocument, Simulate}
  from 'react-dom/test-utils';

import {ControlledBase, emptyPage, ItemModel} from '../../src';
import withActions, {PropsType as WithActionsPropsType} from '../../src/actions/withActions';
import ControlledPropsType from '../../src/controlled/ControlledPropsType';
import withSelectable, {PropsType as WithSelectablePropsType} from '../../src/selectable/withSelectable';
import TestWrapper from '../TestWrapper';

const NOOP = () => { /* NOOP */ };
const sleep = async (ms: number): Promise< unknown > => new Promise(resolve => setTimeout(resolve, ms));

type PageTableProps<T> = WithActionsPropsType<T, WithSelectablePropsType<T, ControlledPropsType<T>>>;
// type PageTableProps<T> = WithSelectablePropsType<T, ControlledPropsType<T>>;

describe('actions/withActions', () => {
  const PageTable = withActions(withSelectable(ControlledBase)) as
    unknown as (<T>(props: PageTableProps<T>) => JSX.Element);

  interface TestItem {id: string}
  const testItemModel = {
    idF: ({id}: TestItem) => id,
    fields: [{key: 'id', title: 'Id', sortable: true}]
  } as ItemModel<TestItem>;

  it('result can be used as JSX element', () => {
    renderIntoDocument(<PageTable
      fetchArgs={{page: 0, size: 10}}
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      onFetchArgsChange={NOOP}
      onRefreshRequired={NOOP}
      page={emptyPage<TestItem>()} />);
  });

  it('refreshed page after and only after action', async () => {
    let promiseResolve: undefined | ((arg: unknown) => unknown) = undefined;
    let promiseReject: undefined | ((arg: unknown) => unknown) = undefined;

    const action = {
      enabled: () => true,
      key: 'test',
      onAction: () => new Promise((resolve, reject) => {
        promiseResolve = resolve;
        promiseReject = reject;
      }),
      refreshAfterAction: true,
      title: 'Test',
      visible: () => true,
    };

    assert.isUndefined(promiseResolve);
    assert.isUndefined(promiseReject);

    let onAfterActionCounter = 0;

    const rendered = renderIntoDocument(<TestWrapper><PageTable
      actions={[action]}
      disableVisibleFieldsChange
      fetchArgs={{page: 0, size: 10}}
      hasError={false}
      itemModel={testItemModel}
      loading={false}
      onAfterAction={() => { onAfterActionCounter++; }}
      onFetchArgsChange={NOOP}
      page={emptyPage<TestItem>()}
      selectable /></TestWrapper>) as unknown as typeof TestWrapper;
    assert.equal(0, onAfterActionCounter);

    const button: HTMLButtonElement = findRenderedDOMComponentWithTag(
      rendered as unknown as Component, 'button') as HTMLButtonElement;
    Simulate.click(button);

    assert.equal(0, onAfterActionCounter);
    assert.isOk(promiseResolve);
    assert.isOk(promiseReject);

    await sleep(0);
    assert.equal(0, onAfterActionCounter);

    promiseResolve!(null);
    await sleep(0);
    assert.equal(1, onAfterActionCounter);
  });
});
