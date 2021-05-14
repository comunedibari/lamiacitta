// SPDX-License-Identifier: AGPL-3.0-or-later
import React from 'react';
import { parseDateToLocalString } from '../../utility/uiUtilities';

const SelectedAssistito = ({ assistito, onCambiaAssistito, ...props }) => {
    const onClickHandler = () => {
        if (typeof onCambiaAssistito === 'function')
            onCambiaAssistito();
    }

    return (assistito ?
        <div>
            <strong className="mr-4" style={{ verticalAlign: 'middle' }}>
                {`${assistito.nome} ${assistito.cognome} - ${assistito.codiceFiscale} - ${parseDateToLocalString(assistito.dataNascita)}`}
            </strong>
            {!!onCambiaAssistito &&
                <button className="btn btn-sm btn-warning" type="button" onClick={() => onClickHandler()}>Cambia assistito</button>
            }
        </div>
        : null);
}

export default SelectedAssistito;