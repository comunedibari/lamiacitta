/* SPDX-License-Identifier: AGPL-3.0-or-later */
const {
    RicercaInterventi,
    NuovoIntervento,
    SceltaAssistito,
    AggiungiInterventi
} = require("../containers/interventi");

export const ROUTE_NAMES = {
    HOME: "ROUTE_HOME",
    INTERVENTO_NUOVO: "INTERVENTO_NUOVO",
    SCELTA_ASSISTITO: "SCELTA_ASSISTITO",
    AGGIUNGI_INTERVENTI: "AGGIUNGI_INTERVENTI"
};

export const ROUTES = {
    ROUTE_NAMES: {
        route: "/",
        component: RicercaInterventi,
    },
    "INTERVENTI_NUOVO": {
        route: "/interventi/nuovo",
        component: NuovoIntervento,
        default: "",
        childRoutes: {
            "SCELTA_ASSISTITO": {
                route: "/step-1",
                component: SceltaAssistito,
            },
            "": {
                route: "/step-2",
                component: AggiungiInterventi,
                prev: "SC"
            },
        }
    }
};