import React, { PureComponent, ReactNode } from 'react';
import ContolledDemo from './ContolledDemo';
import ItemModelExample from './ItemModelExample';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import UncontrolledDemo from './UncontrolledDemo';

interface StateType {
  key: string;
}

export default class Application extends PureComponent<unknown, StateType> {

  state = {
    key: 'uncontrolled',
  }

  private handleKeyChange = ( key:string ) => this.setState( { key } );

  render() : ReactNode {
    const { key } = this.state;

    return <Tabs
      activeKey={key}
      id="tabs"
      onSelect={this.handleKeyChange}>
      <Tab eventKey="contolled" title="Contolled PageTable Demo">
        <ContolledDemo />
      </Tab>
      <Tab eventKey="uncontrolled" title="Uncontrolled PageTable Demo">
        <UncontrolledDemo />
      </Tab>
      <Tab eventKey="itemModelExample" title={<><code>ItemModel</code> example</>}>
        <ItemModelExample />
      </Tab>
    </Tabs>;
  }

}
