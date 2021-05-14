/* SPDX-License-Identifier: AGPL-3.0-or-later */
import * as actionTypes from './actionTypes';

import { $logger } from '../services/LoggerService';

import { $http } from '../services/HttpService';
// import { $http as _$http } from '../services/MockHttpService';

const DEFAULT_LOGIN_TOKEN = "68B100FC-41D5-4AEF-8BCE-87D95E29C748";
$http.setLoginToken(DEFAULT_LOGIN_TOKEN);

const initialState = {
    // props
    loginToken: DEFAULT_LOGIN_TOKEN,
    userProfile: {
        token: DEFAULT_LOGIN_TOKEN,
        username: '',
        nome: null,
        cognome: null,
    },
    operatore: null,
    struttura: null,
    codiceErroreLogin: null,
    messaggioErroreLogin: null,
    configurazione: null,
    messaggioErroreConfigurazione: null,
    datiOperatore: null,
    messaggioErroreDatiOperatore: null,
    // i18n
    i18n: null,
    // services
    loggerService: $logger,
    httpService: $http
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.INIT:
            break;
            
        case actionTypes.SET_I18N:
            state = {
                ...state,
                i18n: action.i18n,
            }
            break;

        case actionTypes.EFFETTUA_LOGOUT:
            state = {
                ...state,
                loginToken: DEFAULT_LOGIN_TOKEN,
                userProfile: {
                    token: DEFAULT_LOGIN_TOKEN,
                    username: '',
                    nome: null,
                    cognome: null,
                },
                operatore: null,
                struttura: null,
                codiceErroreLogin: null,
                messaggioErroreLogin: null,
            }
            break;

        case actionTypes.EFFETTUA_LOGIN_SUCCESSO:
            const { loginData, operatore, struttura } = action.payload;
            state = {
                ...state,
                loginToken: loginData.token,
                userProfile: loginData,
                operatore: operatore,
                struttura: struttura,
                codiceErroreLogin: null,
                messaggioErroreLogin: null,
            }
            break;

        case actionTypes.EFFETTUA_LOGIN_ERRORE:
            state = {
                ...state,
                loginToken: null,
                userProfile: {
                    token: DEFAULT_LOGIN_TOKEN,
                    username: '',
                    nome: null,
                    cognome: null,
                },
                operatore: null,
                struttura: null,
                messaggioErroreLogin: action.messaggioErroreLogin,
                codiceErroreLogin: action.codiceErroreLogin,
            }
            break;

        case actionTypes.SCARICA_CONFIGURAZIONE_SUCCESSO:
            state = {
                ...state,
                configurazione: action.configurazione,
                messaggioErroreConfigurazione: null
            }
            break;

        case actionTypes.SCARICA_CONFIGURAZIONE_ERRORE:
            state = {
                ...state,
                configurazione: null,
                messaggioErroreConfigurazione: action.messaggio
            }
            break;

        case "persist/REHYDRATE":
            state = {
                ...state,
                persistedState: action.payload
            }
            break;

        case "@@INIT":
        case "persist/PERSIST":
            break;

        default:
        // console.log("Action non gestita internamente: " + action.type);
    }

    $http.setLoginToken(state.userProfile.token);
    state.isLoggedIn = state.userProfile !== null
        && !!state.userProfile.token && state.userProfile.token !== DEFAULT_LOGIN_TOKEN;
    state.initialized = state.configurazione !== null && !state.messaggioErroreConfigurazione;

    return state;
};

export default reducer;