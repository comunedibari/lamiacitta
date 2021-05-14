// SPDX-License-Identifier: AGPL-3.0-or-later
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import { Field, Form, ValidationSummary } from '../../fmm/forms';

const formConfig = {
    fields: {
        username: {
            label: "Nome utente",
            validators: {
                errors: {
                    requiredIfEmpty: {
                        message: 'Il campo è obbligatorio.',
                        refs: ['email']
                    }
                }
            }
        },
        email: {
            label: "E-mail",
            validators: {
                errors: {
                    requiredIfEmpty: {
                        message: 'Il campo è obbligatorio.',
                        refs: ['username']
                    },
                    isEmail: {
                        message: 'Il campo deve contenere un indirizzo E-mail valido.',
                    }
                }
            }
        }
    }
};

const RecuperaPassword = ({ onSubmitRecuperaPassword, ...props }) => {
    const onFormSubmitHandler = (form) => {
        props.logger.info('RecuperaPassword.onFormSubmitHandler =>', form);
        if (form.isValid) {
            if (typeof onSubmitRecuperaPassword === "function")
                onSubmitRecuperaPassword(form.values);
        }
    };

    const formNamespace = props.namespace || "recuperapassword";
    return (
        <Form config={formConfig} namespace={formNamespace} onFormSubmit={onFormSubmitHandler} render={
            (form, getFieldProps) => (
                <div className="recupera-password-form__wrapper">
                    <Field
                        type="text"
                        autoComplete="username"
                        {...getFieldProps('username')} />
                    <Field
                        type="email"
                        autoComplete="email"
                        {...getFieldProps('email')} />
                    {(form.hasErrors || form.hasWarnings) && <div className="row">
                        <div className="col-sm-12">
                            <ValidationSummary namespace={formNamespace} form={form} cssClass="" />
                        </div>
                    </div>}
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecuperaPassword));