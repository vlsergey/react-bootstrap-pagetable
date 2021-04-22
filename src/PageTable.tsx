import React, { PureComponent, ReactNode } from 'react';
import Table from 'react-bootstrap/Table';

interface PropsType {
  tableProps: React.ComponentProps<Table>;
}

export default class PageTable extends PureComponent<PropsType> {
  render() : ReactNode {
    const { tableProps } = this.props;

    return <Table {...tableProps} />;
  }
}
