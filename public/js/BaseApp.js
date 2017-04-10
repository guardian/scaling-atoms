import React, {PropTypes} from 'react';
import {Provider} from 'react-redux';
import {Route, IndexRedirect, Router} from 'react-router';

import Page from './components/Page';
import {AtomCreateTypeSelect} from './components/AtomCreate/AtomCreateTypeSelect';
import AtomCreateGenericInfo from './components/AtomCreate/AtomCreateGenericInfo';
import AtomEdit from './components/AtomEdit/AtomEdit';
import AtomStats from './components/AtomStats/AtomStats';
import AtomList from './components/AtomList/AtomList';
import ExternalAtom from './components/ExternalAtom/ExternalAtom';
import AtomRoot from './components/AtomRoot/AtomRoot';


export const BaseApp = (props) => (
  <Provider store={props.store}>
    <Router history={props.history}>
      <Route path="/" component={Page}>
        <Route path="/find" component={AtomList} />
        <Route path="/create" component={AtomCreateTypeSelect} />
        <Route path="/create/:atomType" component={AtomCreateGenericInfo} />
        <Route path="/atoms/:atomType/:id" component={AtomRoot}>
          <Route path="/atoms/:atomType/:id/edit" component={AtomEdit} />
          <Route path="/atoms/:atomType/:id/stats" component={AtomStats} />
        </Route>
        <Route path="/external-atoms/:atomType/:id/link" component={ExternalAtom} />
        <IndexRedirect to="/find" />
      </Route>
    </Router>
  </Provider>
);

BaseApp.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
};
