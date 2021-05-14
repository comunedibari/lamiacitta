/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import Spinner from '../../components/Spinner';

import { FormIntervento } from '../../components/interventi';
import { SelectedAssistito } from '../../components/assistiti';
import { get } from 'lodash';
import ModaleAlertGenerica from '../../components/ModaleAlertGenerica';

class ModificaIntervento extends Component {
    constructor(props) {
        super(props);

        const { match } = this.props;
        const { id } = match.params;

        this.state = {
            idIntervento: +id,
            assistito: null,
            intervento: null,
            loadingIntervento: false,
            errore: null
        };
    }

    componentDidMount() {
        this.props.logger.info('ModificaIntervento.componentDidMount');
        this.setState({
            ...this.state,
            loadingIntervento: true
        });

        this.props.http.request('getIntervento', {
            id: +this.state.idIntervento,
            idStruttura: this.props.struttura.id
        }).then(({ intervento, assistito }) => {
            if (document.getElementById('modificaIntervento')) {
                this.setState({
                    ...this.state,
                    assistito: assistito,
                    intervento: intervento
                });
            }
        }).catch(({ code, message, data }) => {
            // TODO: Handle error
            this.props.logger.info('ModificaIntervento.componentDidMount [ERROR] =>', code, message, data);
        }).finally(() => {
            if (document.getElementById('modificaIntervento')) {
                this.setState({
                    ...this.state,
                    loadingIntervento: false
                });
            }
        });
    }

    onModificaInterventoSubmit(data) {
        this.props.logger.info('ModificaIntervento.onModificaInterventoSubmit =>', data);
        this.setState({
            ...this.state,
            loadingIntervento: true
        });

        this.props.http.request('modificaIntervento', {
            idStruttura: +this.props.struttura.id,
            assistito: this.state.assistito,
            intervento: data
        }).then(() => {
            this.props.history.push("/");
        }).catch(({ code, message, data }) => {
            this.props.logger.info('ModificaIntervento.onModificaInterventoSubmit [ERROR] =>', code, message, data);
            this.setState({
                ...this.state, errore: {
                    message: message, errors: get(data, 'errors', [])
                }
            })
        }).finally(() => {
            if (document.getElementById('modificaIntervento')) {
                this.setState({
                    ...this.state,
                    loadingIntervento: false
                });
            }
        });
    }

    onCancel() {
        this.props.logger.info('ModificaIntervento.onCancel');
        this.props.history.push("/");
    }

    render() {
        return (
            <div className="modifica-intervento__wrapper">
                <h1 id="modificaIntervento">Modifica intervento</h1>
                {/* <pre>{JSON.stringify(this.state.intervento, null, 2)}</pre> */}
                {!this.state.loadingIntervento ?
                    <div>
                        {!!this.state.errore && <ModaleAlertGenerica title="Attenzione! Errore di validazione" {...this.state.errore}
                            chiudiModaleClicked={() => this.setState({ ...this.state, errore: null })} />}
                        <div className="pt-3 mb-3">
                            <SelectedAssistito assistito={this.state.assistito} />
                        </div>
                        <FormIntervento values={this.state.intervento} onSubmit={(data) => this.onModificaInterventoSubmit(data)}
                            onCancel={() => this.onCancel()} texts={{ pristine: 'Ripristina', cancel: 'Annulla modifica' }}/>
                    </div> :
                    <Spinner />}
            </div>
        );
    }
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

// #endregion

export default connect(mapStateToProps)(ModificaIntervento);