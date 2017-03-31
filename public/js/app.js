import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import configurePresence from './util/configurePresence';
import configureStore from './util/configureStore';
import extractQueryParamsFromUrl from './util/extractQueryParamsFromUrl';
import { setStore } from './util/storeAccessor';

import {BaseApp} from './BaseApp.js';

import '../styles/main.scss';

function extractConfigFromPage() {

    const configEl = document.getElementById('config');

    if (!configEl) {
        return {};
    }

    return JSON.parse(configEl.innerHTML);
}


const store = configureStore();
const config = extractConfigFromPage();
const presenceClient = config.presenceEnabled ? configurePresence(config.presenceEndpointURL, config.user) : {};
const queryParams = extractQueryParamsFromUrl();

setStore(store);

// Send config to store on init
store.dispatch({
  type:       'CONFIG_RECEIVED',
  config:     config,
  receivedAt: Date.now()
});

// Start presence on init
store.dispatch({
  type: 'PRESENCE_CLIENT_STARTED',
  presenceClient: presenceClient,
  receivedAt: Date.now()
});

// Store initial query params on init
store.dispatch({
  type: 'QUERY_PARAMS_RECEIVED',
  queryParams: queryParams,
  receivedAt: Date.now()
});

const render = (Component) => {
  ReactDOM.render(
    <AppContainer>
      {Component}
    </AppContainer>,
    document.getElementById('react-mount')
  );
};


render(<BaseApp store={store} />);


//Hot Reloading code
/* global module:false */
if (module.hot) {
  module.hot.accept('./BaseApp.js', () => {
    render(<BaseApp store={store} />);
  });
}
