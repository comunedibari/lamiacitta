// SPDX-License-Identifier: AGPL-3.0-or-later
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Field, Form } from '../../fmm/forms';

const CodiceVerifica = ({ onSubmitCodiceVerifica, ...props }) => {
    const onFormSubmitHandler = (form) => {
        props.logger.info('CodiceVerifica.onFormSubmitHandler =>', form);
        if (form.isValid) {
            if (typeof onSubmitCodiceVerifica === "function")
                onSubmitCodiceVerifica(form.values);
        }
    };

    const formConfig = {
        fields: {
            code: {
                label: "Codice di Verifica",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                        pattern: {
                            message: 'Il formato del codice non è corretto',
                            regex: "^[\\d]+-[\\d]+$",
                        }
                    }
                }
            }
        }
    };

    const formNamespace = props.namespace || "codiceverifica";

    return (
        <Form config={formConfig} namespace={formNamespace} onFormSubmit={onFormSubmitHandler} render={
            (form, getFieldProps) => (
                <div className="recupera-password-form__wrapper">
                    <Field
                        type="text"
                        placeholder="00-000000"
                        autoComplete="code"
                        {...getFieldProps('code')} />
                    <div className="row mt-2 mb-2">
                        <div className="col-sm-12 text-center">
                            <button type="submit" className="btn btn-success">
                                Invia
                            </button>
                        </div>
                    </div>
                </div>
            )} />
    );
}

// #region Redux

const mapStateToProps = state => {
    return {
        logger: state.loggerService
    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

// #endregion

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CodiceVerifica));