import {HashRouter, Link, Route, Switch} from 'react-router-dom';
import React, {PureComponent, ReactNode} from 'react';
import ContolledDemo from './ContolledDemo';
import CustomRowsRendererDemo from './CustomRowsRendererDemo';
import FiltersExample from './FiltersExample';
import ItemModelExample from './ItemModelExample';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import RoutedExample from './RoutedExample';
import UncontrolledDemo from './UncontrolledDemo';

export default class Application extends PureComponent<unknown> {
  override render (): ReactNode {
    return <HashRouter>
      <Navbar expand="lg">
        <Navbar.Brand href="#">React Bootstrap Pagetable Demo</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar" />
        <Navbar.Collapse id="navbar">
          <Nav className="mr-auto">
            <Nav.Link as={Link} key="contolled" to="/controlled">Contolled PageTable Demo</Nav.Link>
            <Nav.Link as={Link} key="uncontrolled" to="/uncontrolled">Uncontrolled PageTable Demo</Nav.Link>
            <Nav.Link as={Link} key="itemModelExample" to="/itemModelExample"><code>ItemModel</code> example</Nav.Link>
            <Nav.Link as={Link} key="filtersExample" to="/filtersExample">Filters example</Nav.Link>
            <Nav.Link as={Link} key="routedExample" to="/routedExample">PageTable with react-router</Nav.Link>
            <Nav.Link as={Link} key="customRowsRenderer" to="/customRowsRenderer">Custom rows renderer</Nav.Link>
          </Nav>
          <Navbar.Text>
            <a href="https://github.com/vlsergey/react-bootstrap-pagetable">GitHub</a>
          </Navbar.Text>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route component={UncontrolledDemo} exact key="/uncontrolled" path="/uncontrolled" />
        <Route component={ContolledDemo} exact key="/controlled" path="/controlled" />
        <Route component={ItemModelExample} exact key="/itemModelExample" path="/itemModelExample" />
        <Route component={FiltersExample} exact key="/filtersExample" path="/filtersExample" />
        <Route component={RoutedExample} exact key="/routedExample" path="/routedExample" />
        <Route component={CustomRowsRendererDemo} exact key="/customRowsRenderer" path="/customRowsRenderer" />
      </Switch>
    </HashRouter>;
  }
}
