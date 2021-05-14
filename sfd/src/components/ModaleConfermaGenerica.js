/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';

const ModaleConfermaGenerica = (props) => {

    let title = "Attenzione";

    if (typeof props.title !== "undefined" && props.title !== null) {
        title = props.title;
    }

    return (<div id="messaggioVisibileModal" className="modal fade in" style={{display: "block"}}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            
                            <h4 className="modal-title">{title}</h4>
                        </div>
                        <div className="modal-body row">
                        {props.messaggio}
                        </div>
                        <div className="modal-footer row">
                            <button onClick={props.yesClicked} type="button" className="btn btn-default" data-dismiss="modal">Si</button>
                            <button onClick={props.noClicked} type="button" className="btn btn-default" data-dismiss="modal">No</button>
                        </div>
                    </div>
                </div>
            </div>);
}

export default ModaleConfermaGenerica;