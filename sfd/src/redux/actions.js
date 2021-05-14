/* SPDX-License-Identifier: AGPL-3.0-or-later */
import { get } from 'lodash';

import * as actionTypes from './actionTypes';

export const init = () => {
  return (dispatch, getState) => {
    const { initialized } = getState();
    if (!initialized) dispatch(scaricaConfigurazione());

    return {
      type: actionTypes.INIT
    };
  }
}

export const setI18n = (i18n) => {
  return {
    type: actionTypes.SET_I18N,
    i18n: i18n,
  };
}

// #region login
export const effettuaLogoutSuccesso = () => {
  return {
    type: actionTypes.EFFETTUA_LOGOUT,
  };
}

export const effettuaLogout = () => {
  return (dispatch, getState) => {
    dispatch(effettuaLogoutSuccesso());
  }
}

export const effettuaLoginSuccesso = (loginData) => {
  return {
    type: actionTypes.EFFETTUA_LOGIN_SUCCESSO,
    payload: loginData
  }
}

export const effettuaLoginErrore = (codiceErrore, messaggioErroreLogin) => {
  return {
    type: actionTypes.EFFETTUA_LOGIN_ERRORE,
    codiceErroreLogin: codiceErrore,
    messaggioErroreLogin: messaggioErroreLogin,
  };
}

export const effettuaLogin = (username, password) => {
  return (dispatch, getState) => {
    const { httpService, loggerService } = getState();
    dispatch(effettuaLogout());

    httpService.request('login', {
      username: username,
      password: password,
    }).then(function (loginData) {

      if (loginData) {
        loggerService.info("Redux.actions.effettuaLogin response =>", loginData);
        loggerService.info("Redux.actions.effettuaLogin =>", "Il token è " + loginData.token);
        httpService.setLoginToken(loginData.token);

        httpService.request('getOperatore', {}).then(function (operatoreData) {
          loggerService.info('Redux.actions.scaricaDatiOperatore =>', operatoreData);
          const operatore = get(operatoreData, 'operatore', null);
          const struttura = get(operatoreData, 'strutture[0]', null);
          // handle success
          dispatch(effettuaLoginSuccesso({ loginData, operatore, struttura }));
        }).catch(({ code, message, data }) => {
          // handle error
          loggerService.info('Redux.actions.scaricaDatiOperatore =>', "1* Errore Scaricamento DatiOperatore: ", code, message, data);
          dispatch(effettuaLoginErrore(code || -1, message));
        });
      }
    }).catch(({ code, message, data }) => {
      loggerService.error("Redux.actions.effettuaLogin =>", "Eccezione: ", code, message, data);
      // handle error
      dispatch(effettuaLoginErrore(code || -1, message));
    });
  }
};

// #endregion login

// #region Configurazione (Voci Elenco)

export const scaricamentoConfigurazioneSuccesso = (configurazione) => {
  return {
    type: actionTypes.SCARICA_CONFIGURAZIONE_SUCCESSO,
    configurazione: configurazione
  };
}

export const scaricamentoConfigurazioneErrore = (msg) => {
  return {
    type: actionTypes.SCARICA_CONFIGURAZIONE_ERRORE,
    messaggio: msg
  };
}

export const scaricaConfigurazione = () => {
  return (dispatch, getState) => {
    const { httpService, loggerService } = getState();

    httpService.request('getConfigurazione', {})
      .then((response) => {
        loggerService.info('Redux.actions.scaricaConfigurazione =>', response);
        dispatch(scaricamentoConfigurazioneSuccesso(response));
      }).catch(({ code, message, data }) => {
        // handle error
        loggerService.info('Redux.actions.scaricaConfigurazione =>', "1* Errore Scaricamento Configurazione: ", code, message, data);
        if (code === 401) {
          dispatch(effettuaLogout());
        }
        else {
          dispatch(scaricamentoConfigurazioneErrore(message));
        }
      });
  }
};

// #endregion

export default {
  init,
  setI18n,
  effettuaLogoutSuccesso,
  effettuaLogout,
  effettuaLoginSuccesso,
  effettuaLoginErrore,
  effettuaLogin,
  scaricamentoConfigurazioneSuccesso,
  scaricamentoConfigurazioneErrore,
  scaricaConfigurazione
}