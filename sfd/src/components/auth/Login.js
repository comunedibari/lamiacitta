// SPDX-License-Identifier: AGPL-3.0-or-later
import React from 'react';
import { connect } from 'react-redux';

import { Field, Form } from '../../fmm/forms';

const Login = ({ onSubmitLogin, ...props }) => {
    const onFormSubmitHandler = (form) => {
        props.logger.info('Login.onFormSubmitHandler =>', form);
        if (form.isValid) {
            if (typeof onSubmitLogin === "function")
                onSubmitLogin(form.values);
        }
    };

    const formConfig = {
        fields: {
            username: {
                label: "Nome utente",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.',
                        }
                    }
                }
            },
            password: {
                label: "Password",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.',
                        }
                    }
                }
            }
        }
    };

    const formNamespace = props.namespace || "loginform";

    return (
        <Form config={formConfig} namespace={formNamespace} onFormSubmit={onFormSubmitHandler} render={
            (form, getFieldProps) => (
                <div className="login-form__wrapper">
                    <Field
                        type="text"
                        autoComplete="username"
                        {...getFieldProps('username')} />
                    <Field
                        type="password"
                        autoComplete="current-password"
                        {...getFieldProps('password')} />
                    {/* // Gli errori qui vengono gestiti diversamente (sopra la form)
                     (form.hasErrors || form.hasWarnings) && <div className="row">
                        <div className="col-sm-12">
                            <ValidationSummary namespace={formNamespace} form={form} cssClass="" />
                        </div>
                     </div>*/}
                    <div className="row mt-2 mb-2">
                        <div className="col-sm-12 text-center">
                            <button type="submit" className="btn btn-success">
                                Accedi
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);