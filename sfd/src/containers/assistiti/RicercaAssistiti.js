/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React, { Component } from 'react';
import { Glyphicon } from 'react-bootstrap';

import { connect } from 'react-redux';

import { FiltroAssistiti, ElencoAssistiti } from '../../components/assistiti';

class RicercaAssistiti extends Component {
    INITIAL_STATE = {
        filtro: {
            cognome: '',
            nome: '',
            codiceFiscale: ''
        },
        ordinamento: {
            field: null,
            asc: false
        },
        paginazione: {
            page: 1,
            limit: 20
        },
        results: null
    };

    constructor(props) {
        super(props);
        this.state = { ...this.INITIAL_STATE };
    }

    //#region React lifecylce 
    componentDidMount() {
        this.search();
    }
    //#endregion

    applyFiltersHandler(e) {
        e.preventDefault();

        this.setState({
            ...this.state,
            paginazione: { ...this.INITIAL_STATE.paginazione },
            results: null
        });

        this.search();
    }

    sortChangeHandler(field) {
        this.props.logger.info('RicercaAssistiti.sortChangeHandler => ', field);
        const ordinamento = { ...this.state.ordinamento };
        if (ordinamento.field === field) {
            ordinamento.asc = !ordinamento.asc;
        } else {
            ordinamento.field = field;
            ordinamento.asc = false;
        }

        this.setState({
            ...this.state,
            ordinamento: ordinamento,
        });

        this.search();
    }

    pageChangeHandler(page) {
        const paginazione = { ...this.state.paginazione };
        paginazione.page = page;

        this.setState({
            ...this.state,
            paginazione: paginazione
        });

        this.search();
    }

    async search() {
        const { filtro, ordinamento, paginazione } = this.state;
        this.props.logger.info('RicercaAssistiti.search => ', filtro, ordinamento, paginazione);

        try {
            const results = await this.props.http.request('getAssititi', {
                filtro: filtro,
                ordinamento: ordinamento,
                paginazione: paginazione
            });

            this.setState({
                ...this.state,
                results: results
            });
        } catch ({ code, message, data }) {
            this.props.logger.info('RicercaAssistiti.search => ', code, message, data);
        }
    }

    selectedItemHandler() {
        this.props.logger.info('RicercaAssistiti.selectedItemHandler => ', e);
    }

    render() {
        return (
            <div className="ricerca-assistiti--wrapper">
                <h1>Ricerca assisiti</h1>
                <div className="ricerca-assistiti--filtro container">
                    <FiltroAssistiti filtro={this.state.filtro} onApplyFilters={(e) => this.applyFiltersHandler(e)} />
                </div>
                <div className="ricerca-assistiti--results">
                    <ElencoAssistiti results={this.state.results} sort={this.state.ordinamento}
                        paginazione={this.state.paginazione} onSortChange={(e) => this.sortChangeHandler(e)}
                        onPageChange={(e) => this.pageChangeHandler(e)} actions={(data) =>
                            <button className="btn btn-info" onClick={() => this.onSelectedItem(data)}>
                                <Glyphicon glyph="ok"></Glyphicon>
                            </button>
                        } />
                </div>
            </div>
        );
    }
}

// #region Redux

const mapStateToProps = state => {
    return {
        // props
        // loginToken: state.loginToken,
        configurazione: state.configurazione,
        // services
        http: state.httpService,
        logger: state.loggerService
    };
};

// #endregion

export default connect(mapStateToProps)(RicercaAssistiti);