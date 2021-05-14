/* SPDX-License-Identifier: AGPL-3.0-or-later */
import { createStore, applyMiddleware, compose } from 'redux';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import thunk from 'redux-thunk';

import reducer from './reducer';

const persistConfig = {
    key: 'root',
    storage: storage /*new CookieStorage(Cookies, {
      expiration: {
        'default': 365 * 86400 // Cookies expire after one year
      }
    })*/,
    whitelist: ['loginToken', 'userProfile', 'operatore', 'struttura']
}

const persistedReducer = persistReducer(persistConfig, reducer)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export let store = createStore(persistedReducer, composeEnhancers(applyMiddleware(thunk)));
export let persistor = persistStore(store, {});

/*
Per usare redux fuori da un componente:

import {store} from './redux/store';
import * as actions from '../redux/actions';

store.dispatch(actions.nomedellaaction(parametri));
store.getState();
*/
