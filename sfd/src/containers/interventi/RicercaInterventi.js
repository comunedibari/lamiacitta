/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import { Glyphicon } from 'react-bootstrap';
import { FiltroInterventi } from '../../components/interventi';
import ElencoInterventi from '../../components/interventi/ElencoInterventi';

const RicercaInterventi = ({ ...props }) => {
    const [filtro, setFiltro] = useState({});
    const [ordinamento, setOrdinamento] = useState({
        asc: false,
        field: "dataInizioIntervento"
    });
    const [paginazione, setPaginazione] = useState({
        page: 1,
        limit: 20
    });

    const [results, setResults] = useState(null);

    useEffect(() => {
        // Ci serve per sapere se questo componente è già stato smontato e quindi non più presente nella pagina
        let isMounted = true;

        // Se non esiste il bottone, non siamo più nella pagina giusta.
        if (document.getElementById('inserimentoIntervento')) {
            props.logger.info('RicercaInterventi.useEffect dopo controllo');
            setResults(null);

            if (!props.struttura) {
                props.effettuaLogout();
                return;
            }

            props.http.request('getInterventi', {
                idStruttura: props.struttura.id,
                filtro: filtro,
                ordinamento: ordinamento,
                paginazione: paginazione
            }).then(data => {
                if (isMounted) {
                    const { count, items } = data;

                    // Se non esiste il bottone, non siamo più nella pagina giusta.
                    if (document.getElementById('inserimentoIntervento')) {
                        setResults({
                            count: count,
                            items: items || []
                        });
                    }
                }
            }).catch(({ code, message, data }) => {
                if (document.getElementById('inserimentoIntervento')) {
                    setResults({
                        erroreRicerca: message
                    });
                }
            });
        }

        return () => { isMounted = false };
    }, [filtro, ordinamento, paginazione]);

    const actionHandler = () => {
        props.logger.info('RicercaInterventi.actionHandler');
        const { history } = props;
        history.push('/interventi/nuovo');
    }

    const applyFilters = (formValues) => {
        props.logger.info('RicercaInterventi.applyFilters => ', formValues);
        setFiltro(formValues);
        paginaChangeHandler(1);
    }

    const sortChangeHandler = (sort) => {
        props.logger.info('RicercaInterventi.sortChangeHandler => ', sort);
        setOrdinamento(sort);
        paginaChangeHandler(1);
    }

    const paginaChangeHandler = (page) => {
        props.logger.info('RicercaInterventi.paginaChangeHandler => ', page);
        setPaginazione({
            ...paginazione,
            page: page
        });
    }

    const onModificaIntervento = ({ item, index, value }) => {
        props.logger.info('RicercaInterventi.onModificaIntervento => ', item, index, value);
        const { history } = props;
        history.push(`/interventi/${value}`);
    }

    return (
        <div className="ricerca-interventi--wrapper">
            <h1>Ricerca interventi</h1>
            <div className="container">
                <FiltroInterventi onApplyFilters={(e) => applyFilters(e)} />
                <div className="row mt-2 mb-2">
                    <div className="col-sm-12 text-center">
                        <button id="inserimentoIntervento" type="button" className="btn btn-md btn-primary" onClick={() => actionHandler()}>
                            Inserisci nuovo intervento
                        </button>
                    </div>
                </div>
            </div>
            <div className="ricerca-interventi--results">
                <ElencoInterventi results={results} sort={ordinamento}
                    paginazione={paginazione} onSortChange={(e) => sortChangeHandler(e)}
                    onPageChange={(e) => paginaChangeHandler(e)} actions={(data) =>
                        <button type="button" className="btn btn-info" onClick={() => onModificaIntervento(data)}>
                            <Glyphicon glyph="pencil"></Glyphicon>
                        </button>} />
            </div>
        </div >
    )
}

// #region Redux

const mapStateToProps = state => {
    return {
        // props
        // loginToken: state.loginToken,
        struttura: state.struttura,
        configurazione: state.configurazione,
        // services
        http: state.httpService,
        logger: state.loggerService,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        effettuaLogout: () => dispatch(actions.effettuaLogout()),
    }
};

// #endregion

export default connect(mapStateToProps, mapDispatchToProps)(RicercaInterventi);