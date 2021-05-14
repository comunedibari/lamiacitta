/* SPDX-License-Identifier: AGPL-3.0-or-later */
var url = window.location.href;
var arr = url.split("/");

export const URL_PORTALE = process.env.REACT_APP_API_URL || (arr[0] + '//' + arr[2]);

export const WS_ENDPOINTS = {
    default: '/ServiziFruizioneDiffusa.aspx',
    utenti: '/ServiziUtente.aspx'
}

export const DEBUG = 1; // 4 è modalità silenziosa, 3 = errori, 2 = warning, 1 = info, 0 = verbose 

export const NAZIONE_ITALIA = 5;
export const FONTEDATI_ESTERNO = 'esterno';

export default {
    URL_PORTALE,
    WS_ENDPOINTS,
    DEBUG,
    NAZIONE_ITALIA
}