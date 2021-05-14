/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';

import { Glyphicon } from 'react-bootstrap';

import { FONTEDATI_ESTERNO } from '../../shared/constants';

import { FiltroAssistiti, ElencoAssistiti, FormAssistito } from '../../components/assistiti';
import { Link } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import * as uiutils from '../../utility/uiUtilities';

const SceltaAssistito = ({ values, onAssistitoSelected, ...props }) => {
    const [loading, setLoading] = useState(false);
    const [assistito, setAssistito] = useState(values);
    const [assistitoReadOnly, setAssistitoReadOnly] = useState(false);

    useEffect(() => {
        uiutils.scrollToTop();
        props.logger.info("SceltaAssistito.useEffect [assistito] => ", assistito);
        const readOnly = assistito !== null
            && (!!assistito.id || assistito.fonteDati === FONTEDATI_ESTERNO);
        setAssistitoReadOnly(readOnly);
    }, [assistito])

    const [mostraRicerca, setMostraRicerca] = useState(false);

    const [filtro, setFiltro] = useState({});
    const [ordinamento, setOrdinamento] = useState({});
    const [paginazione, setPaginazione] = useState({
        page: 1,
        limit: 20
    });

    const [results, setResults] = useState(null);

    useEffect(() => {
        // Ci serve per sapere se questo componente è già stato smontato e quindi non più presente nella pagina
        let isMounted = true;

        props.logger.info("SceltaAssistito.useEffect [mostraRicerca, filtro, ordinamento]");
        setResults(null);
        if (mostraRicerca && filtro) {

            const cerca = (escludiFonteDatiEsterna = false) => {
                props.http.request('getAssistiti', {
                    filtro: filtro,
                    ordinamento: ordinamento,
                    paginazione: paginazione,
                    escludiFonteDatiEsterna: escludiFonteDatiEsterna // TODO: Abilitare mock da SOAP UI
                }).then(data => {
                    if (isMounted) {
                        const { count, items } = data;

                        setResults({
                            count: count,
                            items: items || []
                        });
                    }
                }).catch(({ code, message, data }) => {
                    if (escludiFonteDatiEsterna) {
                        setResults({
                            count: 0, items: [], erroreRicerca: message
                        });
                    } else {
                        cerca(true);
                    }
                });
            }

            cerca();
        }

        return () => { isMounted = false };

    }, [mostraRicerca, filtro, ordinamento]);

    useEffect(() => {
        props.logger.info("SceltaAssistito.useEffect [results, paginazione]");
        if (!results) setPagedResults(null);
        else {
            setPagedResults({
                ...results,
                items: !results.items ? [] : results.items.slice((paginazione.page - 1) * paginazione.limit, paginazione.page * paginazione.limit)
            });
        }
    }, [results, paginazione]);

    //#region Elenco assistiti

    const applyFiltersHandler = (e) => {
        props.logger.info('SceltaAssistito.applyFiltersHandler =>', e);
        setMostraRicerca(true);
        setFiltro({ ...e });
        setPaginazione({
            ...paginazione,
            page: 1
        });
    }

    const sortChangeHandler = (sort) => {
        props.logger.info('SceltaAssistito.sortChangeHandler =>', sort);
        setOrdinamento(sort);
        setPaginazione({
            ...paginazione,
            page: 1
        });
    }

    const [pagedResults, setPagedResults] = useState(null);

    const pageChangeHandler = (page) => {
        props.logger.info('SceltaAssistito.pageChangeHandler =>', page);
        setPaginazione({
            ...paginazione,
            page: page
        });
    }

    //#endregion

    const itemSelectedHandler = ({ item, index, value }) => {
        props.logger.info('SceltaAssistito.itemSelectedHandler =>', item, index, value);
        const { id, codiceFiscale, fonteDati } = item;
        setLoading(true);
        props.http.request('getAssistito', {
            id: id,
            codiceFiscale: codiceFiscale,
            fonteDati: fonteDati
        }).then((response) => {
            setAssistito(response);
        }).catch(({ code, message, data }) => {
            // TODO: Handle error
            props.logger.error('SceltaAssistito.itemSelectedHandler [ERROR] =>', code, message, data);
        }).finally(() => {
            setLoading(false);
        });
    }

    const onSubmitAssistito = (data) => {
        props.logger.info('SceltaAssistito.onSubmitAssistito =>', data, assistito);
        setLoading(true);
        if (assistito && (!assistito.id || assistito.fonteDati === FONTEDATI_ESTERNO)) {
            props.logger.info('SceltaAssistito.richiesta =>', assistito);
            props.http.request('aggiungiAssistito', {
                ...data
            }).then((response) => {
                onAssistitoSelected(response);
            }).catch(({ code, message, data }) => {
                props.logger.error('SceltaAssistito.onSubmitAssistito [ERROR] =>', code, message, data);
            }).finally(() => {
                setLoading(false);
            });
        }
        else onAssistitoSelected(data);
    }

    const actionHandler = () => {
        props.logger.info('SceltaAssistito.actionHandler');
        setAssistito({});
    }

    const cancelHandler = () => {
        props.logger.info('SceltaAssistito.cancelHandler');
        setAssistito(null);
    }

    let content = null;
    if (assistito) {
        content = (
            <div className="scelta-assistito__inserimento">
                <FormAssistito values={assistito}
                    readOnly={assistitoReadOnly}
                    onSubmit={onSubmitAssistito}
                    onCancel={cancelHandler} />
            </div>);
    } else {
        content = (
            <div className="scelta-assistito__ricerca">
                <div className="scelta-assistito__ricerca__filtro container">
                    <FiltroAssistiti onApplyFilters={applyFiltersHandler} />
                </div>
                <div className="row mb-2">
                    <div className="col-sm-12 text-center">
                        <Link className="btn btn-md btn-danger" to="/">
                            Annulla e torna indietro
                        </Link>
                    </div>
                </div>
                {mostraRicerca &&
                    <div className="scelta-assistito__ricerca__results">
                        <ElencoAssistiti results={pagedResults} sort={ordinamento} paginazione={paginazione}
                            onSortChange={(e) => sortChangeHandler(e)} onPageChange={(e) => pageChangeHandler(e)}
                            actions={(data) =>
                                <button type="button" className="btn btn-info" onClick={() => itemSelectedHandler(data)}>
                                    <Glyphicon glyph="ok"></Glyphicon>
                                </button>
                            } />
                    </div>}
                {results &&
                    <div className="row mt-2 mb-2">
                        <div className="col-sm-12 text-center">
                            <button type="button" className="btn btn-md btn-primary" onClick={() => actionHandler()}>
                                Desidero inserire una nuova persona
                            </button>
                        </div>
                    </div>}
            </div>
        );
    }

    return (
        <div className="scelta-assistito__wrapper">
            {!loading ? content : <Spinner />}
        </div>
    );
}

// #region Redux

const mapStateToProps = state => {
    return {
        // props
        // loginToken: state.loginToken,
        configurazione: state.configurazione,
        // services
        http: state.httpService,
        logger: state.loggerService,
    };
};

// #endregion

export default connect(mapStateToProps)(SceltaAssistito);