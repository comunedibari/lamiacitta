import React from 'react';

import { Field, Form, ValidationSummary } from '../../fmm/forms';

/* SPDX-License-Identifier: AGPL-3.0-or-later */

//#region Config e validazione
const formConfig = {
    fields: {
        cognome: {
            label: "Cognome",
            validators: null
        },
        nome: {
            label: "Nome",
            validators: null
        },
        codiceFiscale: {
            label: "Codice fiscale",
            validators: {
                warnings: {
                    pattern: {
                        message: 'Il codice fiscale inserito non è completo.',
                        regex: "^([A-Z]{6}[\\d]{2}[A-Z][\\d]{2}[A-Z][\\d]{3}[A-Z])|([0-9]{16})$",
                    }
                }
            }
        },
        dataIntervento: {
            inizio: {
                label: "Data inizio",
                validators: {
                    errors: {
                        lte: {
                            message: 'La data inizio non può essere superiore alla data di fine.',
                            ref: 'dataIntervento.fine',
                        }
                    }
                },
            },
            fine: {
                label: "Data fine",
                validators: {
                    errors: {
                        gte: {
                            message: 'La data fine non può essere inferiore alla data di inizio.',
                            ref: 'dataIntervento.inizio',
                        }
                    }
                }
            }
        }
    }
}

//#endregion

const FiltroInterventi = ({ values, onApplyFilters, ...props }) => {
    const onFormSubmitHandler = (form) => {
        if (form.isValid && typeof onApplyFilters === "function")
            onApplyFilters(form.values);
    }

    const formNamespace = props.namespace || "filtrointerventi";

    return (
        <Form values={values} namespace={formNamespace} config={formConfig} onFormSubmit={onFormSubmitHandler} render={(
            form,
            // FUNCTIONS
            getFieldProps
        ) => (
            <div className="filtro-interventi__wrapper">
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
                    <div className="col-sm-12 col-md-6">
                        <Field type="date" {...getFieldProps('dataIntervento.inizio')} />
                    </div>
                    <div className="col-sm-12 col-md-6">
                        <Field type="date" {...getFieldProps('dataIntervento.fine')} />
                    </div>
                </div>
                {(form.hasErrors || form.hasWarnings) && <div className="row">
                    <div className="col-sm-12">
                        <ValidationSummary namespace={formNamespace} form={form} cssClass="" />
                    </div>
                </div>}
                <div className="row mt-2 mb-2">
                    <div className="col-sm-12 text-center">
                        <button type="submit" className="btn btn-md btn-success mr-3" form={formNamespace}>Cerca</button>
                        <button type="button" className="btn btn-md btn-default" onClick={form.resetForm}>Pulisci</button>
                    </div>
                </div>
            </div>
        )
        } />
    );
}

export default FiltroInterventi;