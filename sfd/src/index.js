/* SPDX-License-Identifier: AGPL-3.0-or-later */
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { BrowserRouter as Router } from "react-router-dom";

import * as serviceWorker from './serviceWorker';

import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import * as actions from './redux/actions';

import App from './App';
import Layout from './layout/Layout';

import './index.css';

store.dispatch(actions.init());

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Router basename={process.env.PUBLIC_URL}>
        <Layout>
          <App />
        </Layout>
      </Router>
    </PersistGate>
  </Provider>, document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
