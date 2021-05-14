// SPDX-License-Identifier: AGPL-3.0-or-later
import React from 'react';
import { connect } from 'react-redux';

import { Field, Form, ValidationSummary } from '../../fmm/forms';

const ModificaPassword = ({ onSubmitModificaPassword, ...props }) => {
    const onFormSubmitHandler = (form) => {
        props.logger.info('ModificaPassword.onFormSubmitHandler =>', form);
        if (form.isValid) {
            if (typeof onSubmitModificaPassword === "function")
                onSubmitModificaPassword(form.values);
        }
    };

    const formConfig = {
        fields: {
            username: {
                label: "Nome utente",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        }
                    }
                }
            },
            password: {
                label: "Vecchia password",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        }
                    }
                }
            },
            newPassword: {
                label: "Nuova Password",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                        equals: {
                            message: 'Le password devono essere identiche.',
                            ref: 'newPasswordConfirm'
                        }
                    }
                }
            },
            newPasswordConfirm: {
                label: "Conferma password",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                        equals: {
                            message: 'Le password devono essere identiche.',
                            ref: 'newPassword'
                        }
                    }
                }
            },
        }
    };

    const formNamespace = props.namespace || "modificapassword";

    return (
        <Form config={formConfig} namespace={formNamespace} onFormSubmit={onFormSubmitHandler} render={
            (form, getFieldProps) => (
                <div className="recupera-password-form__wrapper">
                    <Field
                        type="text"
                        autoComplete="username"
                        {...getFieldProps('username')} />
                    <Field
                        type="password"
                        autoComplete="password"
                        {...getFieldProps('password')} />
                    <Field
                        type="password"
                        autoComplete="off"
                        {...getFieldProps('newPassword')} />
                    <Field
                        type="password"
                        autoComplete="off"
                        {...getFieldProps('newPasswordConfirm')} />
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
    };
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

// #endregion

export default connect(mapStateToProps, mapDispatchToProps)(ModificaPassword);