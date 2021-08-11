import {PureComponent, ReactNode} from 'react';

export default class TestWrapper extends PureComponent<{children: ReactNode}> {
  override render (): ReactNode {
    return this.props.children;
  }
}
