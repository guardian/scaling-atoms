import React, {PropTypes} from 'react';
import { Provider } from 'react-redux';
import {Router, Route, browserHistory, IndexRedirect} from 'react-router';

import Page from './components/Page';
import {AtomCreateTypeSelect} from './components/AtomCreate/AtomCreateTypeSelect';
import AtomCreateGenericInfo from './components/AtomCreate/AtomCreateGenericInfo';
import AtomEdit from './components/AtomEdit/AtomEdit';
import AtomStats from './components/AtomStats/AtomStats';
import AtomList from './components/AtomList/AtomList';
import ExternalAtomLink from './components/ExternalAtomLink/ExternalAtomLink';
import AtomRoot from './components/AtomRoot/AtomRoot';

export class BaseApp extends React.Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  }

  render () {
    return (
      <Provider store={this.props.store}>
        <Router history={browserHistory}>
          <Route path="/" component={Page}>
            <Route path="/find" component={AtomList} />
            <Route path="/create" component={AtomCreateTypeSelect} />
            <Route path="/create/:atomType" component={AtomCreateGenericInfo} />
            <Route path="/atoms/:atomType/:id" component={AtomRoot}>
              <Route path="/atoms/:atomType/:id/edit" component={AtomEdit} />
              <Route path="/atoms/:atomType/:id/stats" component={AtomStats} />
            </Route>
            <Route path="/external-atoms/:atomType/:id/link" component={ExternalAtomLink} />
            <IndexRedirect to="/find" />
          </Route>
        </Router>
      </Provider>
    );
  }
}
