/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';

import { Column, Grid } from '../grid';
import Spinner from '../Spinner';
import Paginazione from '../Paginazione';
import { get } from 'lodash';
import { parseDateToLocalString } from '../../utility/uiUtilities';

const ElencoInterventi = ({ results, sort, onSortChange, paginazione, onPageChange, actions, ...props }) => {
    let content = null;

    if (!results) {
        content = (<Spinner />)
    }
    else if (!results.items || !results.items.length) {
        content = (
            <div className="well well-sm text-center">
                La ricerca non ha prodotto risultati
            </div>
        );
    }
    else {
        const { items, count } = results;
        content = (
            <div>
                <Grid data={items} sort={sort} onSortChange={onSortChange}>
                    {actions && <Column field="id" render={actions} />}
                    <Column title="Cognome" field="cognome" sortable={true} />
                    <Column title="Nome" field="nome" sortable={true} />
                    <Column title="Data nascita" field="dataNascita" sortable={true} render={({ item, index, value }) => (
                        <span>{parseDateToLocalString(value)}</span>
                    )} />
                    <Column title="Codice Fiscale" field="codiceFiscale" sortable={true} />
                    <Column title="Data inizio intervento" field="dataInizioIntervento" sortable={true} render={({ item, index, value }) => (
                        <span>{parseDateToLocalString(value)}</span>
                    )} />
                    <Column title="Data fine intervento" field="dataFineIntervento" sortable={true} render={({ item, index, value }) => (
                        <span>{parseDateToLocalString(value)}</span>
                    )} />
                    {/* <Column title="Area" field="area.nome" sortable={false} />
                    <Column title="Ambito" field="ambito.nome" sortable={false} /> */}
                    <Column title="Servizio" sortable={false} render={({ item, index, value }) => (
                        <span>{`(${get(item, 'area.nome', '--').substring(0, 2)}.${get(item, 'ambito.nome', '--').substring(0, 2)}) ${get(item, 'servizio.nome', '--')}`}</span>
                    )} />
                </Grid>
                <Paginazione risultati={count} elementiPerPagina={paginazione.limit}
                    paginaCorrente={paginazione.page} paginaClicked={onPageChange} />
            </div>
        );
    }

    return (content);
}

export default ElencoInterventi;