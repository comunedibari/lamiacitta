/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';

const ModaleErroreSalvataggio = (props) => {
    return (
        <div id="messaggioVisibileModal" className="modal fade in" style={{ display: "block" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">

                        <h4 className="modal-title">Errore</h4>
                    </div>
                    <div className="modal-body row">
                        Si è verificato un errore salvando i dati dell'utente: {props.messaggioErrore}.
                        </div>
                    <div className="modal-footer row">
                        <button onClick={props.chiudiModaleClicked} type="button" className="btn btn-default" data-dismiss="modal">Chiudi</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModaleErroreSalvataggio;