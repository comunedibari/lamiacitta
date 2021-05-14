// SPDX-License-Identifier: AGPL-3.0-or-later
import React from 'react';

import Spinner from '../Spinner';
import { Column, Grid } from '../grid';
import Paginazione from '../Paginazione';
import { parseDateToLocalString } from '../../utility/uiUtilities';

const ElencoAssistiti = ({ results, sort, onSortChange, paginazione, onPageChange, actions, ...props }) => {
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
                    <Column title="Codice Fiscale" field="codiceFiscale" sortable={true} />
                    <Column title="Data Nascita" field="dataNascita" sortable={true} render={({ item, index, value }) => (
                        <span>{parseDateToLocalString(value)}</span>
                    )} />
                </Grid>
                <Paginazione risultati={count} elementiPerPagina={paginazione.limit}
                    paginaCorrente={paginazione.page} paginaClicked={onPageChange} />
            </div>
        );
    }

    return (content);
}

export default ElencoAssistiti;