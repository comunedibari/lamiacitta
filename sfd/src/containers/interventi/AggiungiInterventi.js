/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React, { useState } from 'react';

import { get } from 'lodash';
import { connect } from 'react-redux';

import { Glyphicon } from 'react-bootstrap';

import { Column, Grid } from '../../components/grid';
import ModaleAlertGenerica from '../../components/ModaleAlertGenerica';
import ModaleConfermaGenerica from '../../components/ModaleConfermaGenerica';

import { FormIntervento } from '../../components/interventi';
import { SelectedAssistito } from '../../components/assistiti';
import { parseDateToLocalString, parseStringToDate, scrollElementToY } from '../../utility/uiUtilities';

const AggiungiInterventi = ({ values, assistito, onInterventiSaved, onCancel, ...props }) => {
    const [interventi, setInterventi] = useState([]);
    const [alertDialog, setAlertDialog] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState(null);

    const onRemoveItervento = ({ item, index, value }) => {
        props.logger.info('InserimentoIntervento.onRemoveItervento =>', item, index, value);
        const { area, ambito, servizio, dataInizioIntervento, dataFineIntervento } = item;

        setConfirmDialog({
            title: "Attenzione!",
            messaggio: `Rimuovere dall'elenco degli interventi l'intervento per il servizio: "${area.nome}" > "${ambito.nome}" > "${servizio.nome}" in data ${dataInizioIntervento}/${dataFineIntervento}?`,
            yesClicked: () => {
                const _interventi = [...interventi];
                _interventi.splice(index, 1);
                setInterventi(_interventi);
                setConfirmDialog(null);
            },
            noClicked: () => {
                setConfirmDialog(null);
            }
        });
    }

    const validazioneInterventi = (value, values) => {
        props.logger.info('InserimentoIntervento.onContextValidationHandler =>', value, values, interventi);
        const { area, ambito, servizio, dataInizioIntervento, dataFineIntervento } = values;
        if ((!interventi || !interventi.length) || !area || !ambito || !servizio) return null;

        const interventoEsistente = interventi.find(x => (
            x.area.id === area.id && x.ambito.id === ambito.id && x.servizio.id === servizio.id
        ) && (
                parseStringToDate(x.dataInizioIntervento) <= parseStringToDate(dataFineIntervento)
                && parseStringToDate(x.dataFineIntervento) >= parseStringToDate(dataInizioIntervento)
            ));

        return interventoEsistente ?
            `L'intervento si sovrappone all'intervento: "${area.nome}" > "${ambito.nome}" > "${servizio.nome}", nel periodo ${interventoEsistente.dataInizioIntervento} / ${interventoEsistente.dataFineIntervento}.` : null;
    }

    const onAggiungiInterventoSubmit = (data) => {
        props.logger.info('InserimentoIntervento.onAggiungiInterventoSubmit =>', data, interventi);
        setInterventi([...interventi, data]);
        setAlertDialog({
            type: "info",
            title: "Successo!",
            message: "L'intervento è stato aggiunto correttamente, ricorda di fare 'Invia' per salvarli.",
            chiudiModaleClicked: () => {
                scrollElementToY(`formintervento.area`, 120);
                setAlertDialog(null);
            }
        });
        return { result: true };
    }

    const onInvioInterventi = () => {
        props.logger.info('InserimentoIntervento.onInvioInterventi =>', assistito, interventi);
        props.http.request('aggiungiIntervento', {
            idStruttura: +props.struttura.id,
            assistito: assistito,
            interventi: interventi
        }).then(() => {
            props.logger.info('InserimentoIntervento.onInvioInterventi [OK]');
            onInterventiSaved(interventi);
        }).catch(({ code, message, data }) => {
            props.logger.info('InserimentoIntervento.onInvioInterventi [ERROR] =>', code, message, data);
            setAlertDialog({
                type: "error",
                message: message,
                messages: get(data, 'errors', []),
                chiudiModaleClicked: () => setAlertDialog(null)
            });
        });
    }

    return (
        <div className="inserimento-interventi__wrapper">
            {!!confirmDialog && <ModaleConfermaGenerica {...confirmDialog} />}
            {!!alertDialog && <ModaleAlertGenerica {...alertDialog} />}
            <div className="pt-3 mb-3">
                <SelectedAssistito assistito={assistito} onCambiaAssistito={onCancel} />
            </div>
            <div className="mt-2 mb-2">
                <FormIntervento onSubmit={(data) => onAggiungiInterventoSubmit(data)} onCancel={onCancel}
                    validazioneInterventi={validazioneInterventi} texts={{ submit: 'Aggiungi' }} />
            </div>
            {!!interventi.length && <div className="mt-2 mb-2">
                <Grid data={interventi}>
                    <Column field="id" render={(e) => (
                        <button type="button" className="btn btn-danger"
                            onClick={() => onRemoveItervento(e)}>
                            <Glyphicon glyph="trash" />
                        </button>
                    )} />
                    <Column title="Area intervento" field="area.nome" />
                    <Column title="Ambito intervento" field="ambito.nome" />
                    <Column title="Servizio" field="servizio.nome" />
                    <Column title="Data inizio" field="dataInizioIntervento" sortable={true} render={({ item, index, value }) => (
                        <span>{parseDateToLocalString(value)}</span>
                    )} />
                    <Column title="Data fine" field="dataFineIntervento" sortable={true} render={({ item, index, value }) => (
                        <span>{parseDateToLocalString(value)}</span>
                    )} />
                    <Column title="Freq.fruizione" field="frequenzaFruizioneServizio" sortable={true} render={({ item, index, value }) => (
                        <span>{value.nome}</span>
                    )} />
                </Grid>
            </div>}
            {!!interventi.length && <div className="mt-2 mb-2 text-center">
                <button type="button" className="btn btn-success" onClick={() => onInvioInterventi()}>
                    Invia
                </button>
            </div>}
        </div>
    );
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
        logger: state.loggerService
    };
};

// #endregion

export default connect(mapStateToProps)(AggiungiInterventi);