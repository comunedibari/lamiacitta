/* SPDX-License-Identifier: AGPL-3.0-or-later */
import axios from 'axios';

import { store } from '../redux/store';
import * as actions from '../redux/actions';

import { $logger } from './LoggerService';

import { URL_PORTALE, WS_ENDPOINTS } from '../shared/constants';

class HttpService {
    #LOGIN_TOKEN = null;

    #HTTP = axios.create({
        method: "POST",
        baseURL: URL_PORTALE,
        url: WS_ENDPOINTS.default,
        headers: { 'Content-Type': 'application/json' }
    });

    setLoginToken(loginToken) {
        this.#LOGIN_TOKEN = loginToken;
    }

    getCancelToken() {
        return axios.CancelToken.source();
    }

    async request(method, params = {}, config = {}) {
        if (!this.#LOGIN_TOKEN)
            throw new Error('Login token is not valid!');

        try {
            const requestConfig = {
                ...this.#HTTP.defaults,
                ...config,
                data: {
                    token: this.#LOGIN_TOKEN,
                    method: method,
                    param: params
                }
            };

            $logger.info(`HttpService.request ${method} =>`, method, params, requestConfig);
            const { status, statusText, data } = await this.#HTTP.request(requestConfig);
            $logger.info(`HttpService.response ${method} =>`, status, statusText, data);

            const { success, code, message } = data.result;
            const responseData = data.data ? JSON.parse(data.data) : {};
            if (success) {
                return responseData;
            } else {
                switch (code) {
                    case 401:
                        store.dispatch(actions.effettuaLogout());
                        // eslint-disable-next-line
                        throw { code, message, data: null };

                    default:
                        // eslint-disable-next-line
                        throw { code, message, data: responseData };
                }
            }
        } catch (error) {
            // handle error
            $logger.error(`HttpService.error ${method} =>`, error);
            throw error;
        }
    }
}

export const $http = new HttpService();
