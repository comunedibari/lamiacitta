/* SPDX-License-Identifier: AGPL-3.0-or-later */
import { $logger } from "./LoggerService";
import { $http as httpService } from "./HttpService";

class MockHttpService {
    #LOGIN_TOKEN = null;

    setLoginToken(loginToken) {
        httpService.setLoginToken(loginToken);
        this.#LOGIN_TOKEN = loginToken;
    }

    getCancelToken() {
        return httpService.getCancelToken();
    }

    async request(method, params = {}, config = {}) {
        $logger.info(`MockHttpService.request ${method} =>`, this.#LOGIN_TOKEN, params, config);

        switch (method) {
            case 'login':
            case 'getOperatore':
            case 'getInterventi':
            case 'getIntervento':
            case 'getAssistiti':
            case 'getAssistito':
            case 'validaAssistito':
            case 'ricercaValori':
            case 'getConfigurazione':
            case 'calcolaCodiceFiscale':
            case 'generaRecuperoPassword':
            case 'confermaRecuperoPassword':
                return await httpService.request(method, params, config);
            default: break;
        }

        return await new Promise((resolve, reject) => {
            let value = null;
            switch (method) {
                case 'getInterventi':
                    value = {
                        page: 1,
                        count: 2,
                        items: [
                            {
                                id: "1",
                                nome: "Mario",
                                cognome: "Rossi",
                                dataNascita: "01/01/1990",
                                codiceFiscale: "XXXXXXXXXXXXX",
                                dataInizioIntervento: "01/01/1999",
                                dataFineIntervento: "01/01/2000",
                                area: {
                                    id: 1,
                                    nome: "Area 1"
                                },
                                ambito: {
                                    id: 1,
                                    nome: "Ambito 1"
                                },
                                servizio: {
                                    id: 1,
                                    nome: "Servizio 1"
                                }
                            },
                            {
                                id: "2",
                                nome: "Mario",
                                cognome: "Rossi",
                                dataNascita: "01/01/1990",
                                codiceFiscale: "XXXXXXXXXXXXX",
                                dataInizioIntervento: "01/01/1999",
                                dataFineIntervento: "01/01/2000",
                                area: {
                                    id: 1,
                                    nome: "Area 1"
                                },
                                ambito: {
                                    id: 1,
                                    nome: "Ambito 1"
                                },
                                servizio: {
                                    id: 1,
                                    nome: "Servizio 1"
                                }
                            },
                        ]
                    };
                    break;
                case 'getIntervento':
                    value = {
                        id: "1",
                        dataInizioIntervento: "01/01/1999",
                        dataFineIntervento: "01/01/2000",
                        area: {
                            id: 1,
                            nome: "Area 1"
                        },
                        ambito: {
                            id: 1,
                            nome: "Ambito 1"
                        },
                        servizio: {
                            id: 1,
                            nome: "Servizio 1"
                        },
                        titolo: "Intervento n° 1",
                        note: "Note",
                        numeroComponenti: 2,
                        attivitaLavorativa: {
                            id: 1,
                            nome: "Lavoro 1",
                        },
                        invalidita: {
                            presente: true,
                            percentuale: 50
                        },
                        presenzaAnzianiDisabili: true,
                        assistito: {
                            id: 1,
                            nome: "Mario",
                            cognome: "Rossi",
                            dataNascita: "01/01/1990",
                            codiceFiscale: "XXXXXXXXXXXXX",
                        }
                    };
                    break;
                case 'getAssistiti':
                    value = {
                        page: 1,
                        count: 8,
                        items: [
                            {
                                id: null, // in caso di fonteDati == "esterno"
                                nome: "Mario",
                                cognome: "Rossi",
                                dataNascita: "01/01/1990",
                                codiceFiscale: "XXXXXXXXXXXXX",
                                fonteDati: "esterno"
                            },
                            {
                                id: 1, // in caso di fonteDati == "gestionale"
                                nome: "Mario",
                                cognome: "Rossi",
                                dataNascita: "01/01/1990",
                                codiceFiscale: "XXXXXXXXXXXXX",
                                fonteDati: "gestionale"
                            },
                            {
                                id: 2, // in caso di fonteDati == "gestionale"
                                nome: "Mario",
                                cognome: "Rossi",
                                dataNascita: "01/01/1990",
                                codiceFiscale: "XXXXXXXXXXXXX",
                                fonteDati: "gestionale"
                            },
                            {
                                id: 3, // in caso di fonteDati == "gestionale"
                                nome: "Mario",
                                cognome: "Rossi",
                                dataNascita: "01/01/1990",
                                codiceFiscale: "XXXXXXXXXXXXX",
                                fonteDati: "gestionale"
                            },
                            {
                                id: 4, // in caso di fonteDati == "gestionale"
                                nome: "Mario",
                                cognome: "Rossi",
                                dataNascita: "01/01/1990",
                                codiceFiscale: "XXXXXXXXXXXXX",
                                fonteDati: "gestionale"
                            },
                            {
                                id: 5, // in caso di fonteDati == "gestionale"
                                nome: "Mario",
                                cognome: "Rossi",
                                dataNascita: "01/01/1990",
                                codiceFiscale: "XXXXXXXXXXXXX",
                                fonteDati: "gestionale"
                            },
                            {
                                id: 6, // in caso di fonteDati == "gestionale"
                                nome: "Mario",
                                cognome: "Rossi",
                                dataNascita: "01/01/1990",
                                codiceFiscale: "XXXXXXXXXXXXX",
                                fonteDati: "gestionale"
                            },
                            {
                                id: 7, // in caso di fonteDati == "gestionale"
                                nome: "Mario",
                                cognome: "Rossi",
                                dataNascita: "01/01/1990",
                                codiceFiscale: "XXXXXXXXXXXXX",
                                fonteDati: "gestionale"
                            }
                        ]
                    }
                    break;
                case 'getAssistito':
                    value = {
                        id: null, // in caso di fonteDati == "esterno"
                        nome: "Mario",
                        cognome: "Rossi",
                        dataNascita: "1990-01-01",
                        codiceFiscale: "XXXXXXXXXXXXX",
                        fonteDati: "esterno",
                        sesso: {
                            id: 1,
                            nome: "Maschio"
                        },
                        luogoNascita: {
                            nazione: {
                                id: 1,
                                nome: "Italia"
                            },
                            provincia: {
                                id: 1,
                                nome: "Modena"
                            },
                            comune: {
                                id: 1,
                                nome: "Modena"
                            }
                        },
                        luogoResidenza: {
                            nazione: {
                                id: 1,
                                nome: "Italia"
                            },
                            provincia: {
                                id: 1,
                                nome: "Modena"
                            },
                            comune: {
                                id: 1,
                                nome: "Modena"
                            }
                        },
                        cittadinanza: {
                            id: 1,
                            nome: "Italiana"
                        },
                        statusLavorativo: {
                            id: 2418,
                            nome: "01_Sconosciuto"
                        },
                        professioneCorrente: {
                            id: 566,
                            nome: "16_Dirigente o simili"
                        },
                        professionePrecedente: {
                            id: 166,
                            nome: "11_Coltivatore diretto"
                        },
                        invalidita: {
                            presente: true,
                            percentuale: 50
                        }
                    }
                    break;
                case 'ricercaValori':
                    value = {
                        items: [{
                            id: 1,
                            nome: "Item 1"
                        }, {
                            id: 2,
                            nome: "Item 2"
                        }, {
                            id: 3,
                            nome: "Item 3"
                        }, {
                            id: 4,
                            nome: "Item 4"
                        }, {
                            id: 5,
                            nome: "Item 5"
                        },]
                    };
                    break;
                case 'getOperatore':
                    value = JSON.stringify({
                        operatore: {
                            id: 270,
                            nome: "informazioni",
                            cognome: "Per maggiori",
                            codiceFiscale: ""
                        }, strutture: [{
                            id: 386,
                            nome: "AFFIDO FAMILIARE - PROGETTO DOMUS",
                            areeIntervento: [{
                                id: 1,
                                nome: "Area 1",
                                ambiti: [{
                                    id: 1,
                                    nome: "Ambito 1",
                                    servizi: [{
                                        id: 1,
                                        nome: "Servizio 1"
                                    }, {
                                        id: 2,
                                        nome: "Servizio 2"
                                    }]
                                }, {
                                    id: 2,
                                    nome: "Ambito 2",
                                    servizi: [{
                                        id: 3,
                                        nome: "Servizio 3"
                                    }]
                                }]
                            }, {
                                id: 2,
                                nome: "Area 2",
                                ambiti: [{
                                    id: 3,
                                    nome: "Ambito 3",
                                    servizi: [
                                        {
                                            id: 4,
                                            nome: "Servizio 4"
                                        }
                                    ]
                                }]
                            }]
                        }]
                    })
                    break;
                default:
                    value = {};
                    break;
                // case '':
                //     value = {};
                //     break;
            }

            const response = {
                result: { success: true, message: "OK" },
                data: value
            };

            $logger.info(`MockHttpService.response ${method} =>`, response);

            setTimeout(() => {
                resolve(response);
            }, 2000)
        });
    }
}

export const $http = new MockHttpService();
