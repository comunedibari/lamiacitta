/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';

const ModaleAlertGenerica = ({ type, title, message, messages, chiudiModaleClicked, ...props }) => {
    const _title = title || "Errore";
    const _type = type || "error";

    return (
        <div id="messaggioVisibileModal" className="modal fade in" style={{ display: "block" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">{_title}</h4>
                    </div>
                    <div className="modal-body">
                        <h4>{message}</h4>
                        {messages && messages.length ?
                            <ul className="pl-3">
                                {messages.map((x, i) => (<li key={`modal-${_type}__${i}`}>{x}</li>))}
                            </ul> : null}
                    </div>
                    <div className="modal-footer row">
                        <button onClick={chiudiModaleClicked} type="button" className="btn btn-default" data-dismiss="modal">
                            Chiudi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModaleAlertGenerica;