// SPDX-License-Identifier: AGPL-3.0-or-later
import React from 'react';

import { useForm } from '../../fmm/hooks/form';
import { Field, ValidationSummary } from '../../fmm/forms';
import { get } from 'lodash';

//#region Config e validazione

const fieldConfig = {
    cognome: {
        label: "Cognome",
        validators: {
            errors: {
                requiredIf: {
                    message: 'Il campo è obbligatorio.',
                    predicate: (value, values) => {
                        return !get(values, 'codiceFiscale');
                    }
                }
            }
        }
    },
    nome: {
        label: "Nome",
        validators: {
            errors: {
                requiredIf: {
                    message: 'Il campo è obbligatorio.',
                    predicate: (value, values) => {
                        return !get(values, 'codiceFiscale');
                    }
                }
            }
        }
    },
    codiceFiscale: {
        label: "Codice fiscale",
        validators: {
            errors: {
                requiredIf: {
                    message: 'Il campo è obbligatorio.',
                    predicate: (value, values) => {
                        return !get(values, 'nome') && !get(values, 'cognome');
                    }
                }
            },
            warnings: {
                pattern: {
                    message: 'Codice fiscale inserito è parziale, per una miglior ricerca inserire il codice fiscale completo.',
                    regex: "^[A-Z]{6}[\\d]{2}[A-Z][\\d]{2}[A-Z][\\d]{3}[A-Z]$",
                }
            }
        },
    }
}

//#endregion

const FiltroAssistiti = ({ values, onApplyFilters, ...props }) => {
    const formConfig = {
        namespace: props.namespace || "filtroassistiti",
        fields: fieldConfig,
        onFormSubmit: (form) => {
            if (form.isValid && typeof onApplyFilters === "function")
                onApplyFilters(form.values);
        }
    }

    const {
        form,
        formProps,
        getFieldProps
    } = useForm(values, formConfig);

    const { id, name, onSubmit } = formProps;

    return (
        <form className="form__wrapper" id={id} name={name} onSubmit={onSubmit}>
            <div className="filtro-assistiti__wrapper">
                <div className="alert alert-info">
                    <strong>Attenzione!</strong>&nbsp;Per effettuare una ricerca inserire cognome e nome o codice fiscale.
                </div>
                <div className="row">
                    <div className="col-sm-12 col-md-6">
                        <Field type="text" {...getFieldProps('cognome')} />
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <Field type="text" {...getFieldProps('nome')} />
                    </div>
                    <div className="col-sm-12">
                        <Field type="text" {...getFieldProps('codiceFiscale')} />
                    </div>
                </div>
                {(form.hasErrors || form.hasWarnings) && <div className="row">
                    <div className="col-sm-12">
                        <ValidationSummary namespace={formConfig.namespace} form={form} cssClass="" />
                    </div>
                </div>}
                <div className="row mt-2 mb-2">
                    <div className="col-sm-12 text-center">
                        <button type="submit" className="btn btn-md btn-success mr-3" form={id}>Cerca</button>
                        <button type="button" className="btn btn-md btn-default" onClick={form.resetForm}>Pulisci</button>
                    </div>
                </div>
            </div>
        </form>
    );
}

export default FiltroAssistiti;