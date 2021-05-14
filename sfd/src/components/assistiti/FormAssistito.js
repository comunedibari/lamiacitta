// SPDX-License-Identifier: AGPL-3.0-or-later
import React, { useState } from 'react';
import { get } from 'lodash';

import { connect } from 'react-redux';
import { Button, ControlLabel, FormControl, FormGroup, HelpBlock, InputGroup } from 'react-bootstrap';

import { Form, Field, AutocompleteField, SelectField, ValidationSummary } from '../../fmm/forms';
import ModaleAlertGenerica from '../ModaleAlertGenerica';

import { NAZIONE_ITALIA } from '../../shared/constants';

//#region Config e validazione

const isItalia = (value, values) => {
    // console.log('isItalia => ', value, values);
    return (!get(values, 'luogoNascita.nazione') || get(values, 'luogoNascita.nazione.id') === NAZIONE_ITALIA)
        && !value;
};

const formConfig = {
    fields: {
        cognome: {
            default: null,
            label: "Cognome",
            validators: {
                errors: {
                    required: {
                        message: 'Il campo è obbligatorio.'
                    }
                }
            }
        },
        nome: {
            default: null,
            label: "Nome",
            validators: {
                errors: {
                    required: {
                        message: 'Il campo è obbligatorio.'
                    }
                }
            }
        },
        codiceFiscale: {
            default: null,
            label: "Codice fiscale",
            validators: {
                errors: {
                    required: {
                        message: 'Il campo è obbligatorio.'
                    },
                    pattern: {
                        message: 'Il formato del codice fiscale non è corretto',
                        regex: "^[A-Z]{6}[\\d]{2}[A-Z][\\d]{2}[A-Z][\\d]{3}[A-Z]$",
                    }
                }
            }
        },
        sesso: {
            default: null,
            label: "Sesso",
            validators: {
                errors: {
                    required: {
                        message: 'Il campo è obbligatorio.'
                    }
                }
            }
        },
        dataNascita: {
            default: null,
            label: "Data di nascita",
            validators: {
                errors: {
                    required: {
                        message: 'Il campo è obbligatorio.'
                    },
                    lte: {
                        message: 'Non è possibile inserire una data superiore ad oggi.',
                        val: new Date().toJSON().slice(0, 10)
                    }
                }
            }
        },
        luogoNascita: {
            nazione: {
                default: null,
                label: "Nazione",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        }
                    }
                }
            },
            provincia: {
                default: null,
                label: "Provincia",
                validators: {
                    errors: {
                        requiredIf: {
                            message: 'Il campo è obbligatorio.',
                            predicate: isItalia
                        }
                    }
                }
            },
            comune: {
                default: null,
                label: "Comune",
                validators: {
                    errors: {
                        requiredIf: {
                            message: 'Il campo è obbligatorio.',
                            predicate: isItalia
                        }
                    }
                }
            },
            comuneEstero: {
                default: null,
                label: "Comune",
                validators: {
                    errors: {
                        requiredIf: {
                            message: 'Il campo è obbligatorio.',
                            predicate: (value, values) => {
                                // console.log(value, values);
                                return get(values, 'luogoNascita.nazione') !== null
                                    && get(values, 'luogoNascita.nazione.id') !== NAZIONE_ITALIA
                                    && !value;
                            }
                        }
                    }
                }
            },
        },
        luogoResidenza: {
            nazione: {
                default: null,
                label: "Nazione",
                validators: null
            },
            provincia: {
                default: null,
                label: "Provincia",
                validators: null
            },
            comune: {
                default: null,
                label: "Comune",
                validators: null
            },
            indirizzo: {
                default: null,
                label: "Indirizzo",
                validators: null
            },
            numeroCivico: {
                default: null,
                label: "Civico",
                validators: null
            },
            cap: {
                default: null,
                label: "CAP",
                validators: null
            }
        },
        cittadinanza: {
            default: null,
            label: "Cittadinanza",
            validators: null
        },
        statusLavorativo: {
            default: null,
            label: "Status lavorativo",
            validators: null
        },
        professioneCorrente: {
            default: null,
            label: "Professione",
            validators: null
        },
        professionePrecedente: {
            default: null,
            label: "Professione precedente",
            validators: null
        },
        invalidita: {
            presente: {
                default: false,
                label: "Presenza invalidità",
                validators: null
            },
            percentuale: {
                default: 0,
                label: "Percentuale di invalidità",
                validators: {
                    errors: {
                        integer: {
                            message: 'Il campo dev\'essere un numero intero.'
                        },
                        range: {
                            message: 'Il valore dev\'essere compreso tra 0 e 100.',
                            min: 0,
                            max: 100
                        }
                    }
                }
            }
        }
    }
}

//#endregion

const FormAssistito = ({ values, readOnly, onSubmit, onCancel, ...props }) => {
    props.logger.info('FormAssistito.values =>', values);
    const [error, setError] = useState(null);

    const onFormSubmitHandler = (form) => {
        props.logger.info('FormAssistito.onFormSubmitHandler =>', form);
        if (readOnly) {
            onSubmit(form.values);
            return;
        }

        if (form.hasErrors)
            return;

        props.http.request('validaAssistito', form.values)
            .then(() => {
                onSubmit(form.values);
            }).catch(({ code, message, data }) => {
                props.logger.warning('FormAssistito.validaAssistito =>', code, message, data);
                setError({
                    message: message,
                    errors: get(data, 'errors', [])
                });
            });
    }

    const calcolaCodiceFiscale = async ({
        nome,
        cognome,
        dataNascita,
        luogoNascita,
        sesso
    }) => {
        props.logger.info('FormAssistito.calcolaCodiceFiscale =>', nome, cognome, dataNascita, luogoNascita, sesso);
        let cf = '';
        if (!nome || !cognome || !dataNascita || !verificaLuogo(luogoNascita) || !sesso) {
            alert('I campi necessari per calcolare il codice fiscale sono: Nome, Cognome, Data di nascita, Luogo di nascita e Sesso');
            return cf;
        }

        try {
            const response = await props.http.request('calcolaCodiceFiscale', {
                nome, cognome, dataNascita, luogoNascita, sesso: sesso.nome
            });
            const { codiceFiscale } = response;
            // TODO: Handler error
            cf = codiceFiscale || '';
        } catch ({ code, message, data }) {
            // TODO: Handler error
            props.logger.info('FormAssistito.calcolaCodiceFiscale [ERROR] =>', code, message, data);
        }

        return cf;
    }

    const verificaLuogo = (luogo) => {
        return !!luogo && !!luogo.nazione; // && !!luogo.provincia && !!luogo.comune;
    }

    const { statusLavorativo, professioni, genere } = props.configurazione;
    props.logger.info('FormAssistito.configurazione =>', statusLavorativo, professioni, genere);

    const formNamespace = props.namespace || "formassistito";

    return (
        <div className="form-assistiti__wrapper">
            <div className="container">
                {readOnly && <div className="alert alert-warning">
                    <strong>Attenzione!</strong>&nbsp;Assicurarsi e verificare che i dati mostrati appartengano alla persona desiderata.
                </div>}
                {!!error && <ModaleAlertGenerica title="Attenzione! Errore di validazione" {...error} chiudiModaleClicked={() => setError(null)} />}
                <Form values={values} namespace={formNamespace} config={formConfig} readOnly={readOnly} onFormSubmit={onFormSubmitHandler} render={(
                    form,
                    // FUNCTIONS
                    getFieldProps
                ) => (
                    <div className="form__body">
                        {/* <pre>{JSON.stringify(values, null, 2)}</pre>
                            <pre>{JSON.stringify(form.values, null, 2)}</pre>
                            <pre>{JSON.stringify(form.getTouched(), null, 2)}</pre>
                            <pre>{JSON.stringify(form.getErrors(), null, 2)}</pre> */}
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Dati anagrafici</h3>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <Field type="text" readOnly={readOnly}
                                            {...getFieldProps('cognome')} />
                                    </div>
                                    <div className="col-sm-12 col-md-6">
                                        <Field type="text" readOnly={readOnly}
                                            {...getFieldProps('nome')} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12">
                                        <FormGroup validationState={(form.getTouched('codiceFiscale') && form.getErrors('codiceFiscale')) && 'error'}>
                                            <ControlLabel>Codice fiscale</ControlLabel>
                                            {readOnly ?
                                                <FormControl type="text" readOnly={readOnly} disabled={readOnly}
                                                    {...getFieldProps('codiceFiscale')} /> :
                                                <InputGroup>
                                                    <FormControl placeholder="Codice Fiscale" type="text" readOnly={readOnly}
                                                        disabled={readOnly} {...getFieldProps('codiceFiscale')} />
                                                    <InputGroup.Button>
                                                        <Button bsStyle="info" onClick={
                                                            async () => form.setFieldValue('codiceFiscale', await calcolaCodiceFiscale(form.values))
                                                        }>Calcola</Button>
                                                    </InputGroup.Button>
                                                </InputGroup>}
                                            {(form.getTouched('codiceFiscale') && form.getErrors('codiceFiscale')) &&
                                                <HelpBlock>{form.getErrors('codiceFiscale')}</HelpBlock>}
                                        </FormGroup>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-md-4">
                                        <SelectField readOnly={readOnly}
                                            fieldProps={getFieldProps('sesso')}
                                            onSelectedItem={(item) => form.setFieldValue('sesso', item)}
                                            options={genere} />
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <Field type="date" readOnly={readOnly}
                                            {...getFieldProps('dataNascita')} />
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <AutocompleteField resource="cittadinanza"
                                            readOnly={readOnly} fieldProps={getFieldProps('cittadinanza')}
                                            onSelectedItem={(item) => form.setFieldValue('cittadinanza', item)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Luogo di nascita</h3>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-sm-12 col-md-4">
                                        <AutocompleteField resource="nazione"
                                            readOnly={readOnly} fieldProps={getFieldProps('luogoNascita.nazione')}
                                            onSelectedItem={(item) => form.setFieldValue('luogoNascita.nazione', item)} />
                                    </div>
                                    {(form.getValue('luogoNascita.nazione.id') === null ||
                                        form.getValue('luogoNascita.nazione.id') === NAZIONE_ITALIA) && <div className="col-sm-12 col-md-4">
                                            <AutocompleteField resource="provincia"
                                                readOnly={readOnly} fieldProps={getFieldProps('luogoNascita.provincia')}
                                                onSelectedItem={(item) => form.setFieldValue('luogoNascita.provincia', item)} />
                                        </div>}
                                    {(form.getValue('luogoNascita.nazione.id') === null ||
                                        form.getValue('luogoNascita.nazione.id') === NAZIONE_ITALIA) && <div className="col-sm-12 col-md-4">
                                            <AutocompleteField resource="comune"
                                                readOnly={readOnly} fieldProps={getFieldProps('luogoNascita.comune')}
                                                onSelectedItem={(item) => form.setFieldValue('luogoNascita.comune', item)} />
                                        </div>}
                                    {(form.getValue('luogoNascita.nazione.id') !== null &&
                                        form.getValue('luogoNascita.nazione.id') !== NAZIONE_ITALIA) && <div className="col-sm-12 col-md-4">
                                            <Field type="text" readOnly={readOnly}
                                                {...getFieldProps('luogoNascita.comuneEstero')} /> </div>}
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Luogo di residenza</h3>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-sm-12 col-md-4">
                                        <AutocompleteField resource="nazione"
                                            readOnly={readOnly} fieldProps={getFieldProps('luogoResidenza.nazione')}
                                            onSelectedItem={(item) => form.setFieldValue('luogoResidenza.nazione', item)} />
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <AutocompleteField resource="provincia"
                                            readOnly={readOnly} fieldProps={getFieldProps('luogoResidenza.provincia')}
                                            onSelectedItem={(item) => form.setFieldValue('luogoResidenza.provincia', item)} />
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <AutocompleteField resource="comune"
                                            readOnly={readOnly} fieldProps={getFieldProps('luogoResidenza.comune')}
                                            onSelectedItem={(item) => form.setFieldValue('luogoResidenza.comune', item)} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-12 col-md-6">
                                        <Field type="text" readOnly={readOnly}
                                            {...getFieldProps('luogoResidenza.indirizzo')} />
                                    </div>
                                    <div className="col-sm-12 col-md-3">
                                        <Field type="text" readOnly={readOnly}
                                            {...getFieldProps('luogoResidenza.numeroCivico')} />
                                    </div>
                                    <div className="col-sm-12 col-md-3">
                                        <Field type="text" readOnly={readOnly}
                                            {...getFieldProps('luogoResidenza.cap')} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Dati lavorativi</h3>
                            </div>
                            <div className="panel-body">
                                <div className="row">
                                    <div className="col-sm-12 col-md-4">
                                        <SelectField readOnly={readOnly}
                                            fieldProps={getFieldProps('statusLavorativo')}
                                            onSelectedItem={(item) => form.setFieldValue('statusLavorativo', item)}
                                            options={statusLavorativo} />
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <SelectField readOnly={readOnly}
                                            fieldProps={getFieldProps('professioneCorrente')}
                                            onSelectedItem={(item) => form.setFieldValue('professioneCorrente', item)}
                                            options={professioni} />
                                    </div>
                                    <div className="col-sm-12 col-md-4">
                                        <SelectField readOnly={readOnly}
                                            fieldProps={getFieldProps('professionePrecedente')}
                                            onSelectedItem={(item) => form.setFieldValue('professionePrecedente', item)}
                                            options={professioni} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h3 className="panel-title">Altri dati</h3>
                            </div>
                            <div className="panel-body">
                                <div className="col-sm-12 col-md-4">
                                    <FormGroup validationState={(form.getTouched('invalidita.percentuale') && form.getErrors('invalidita.percentuale')) && 'error'}>
                                        <ControlLabel>Invalidità</ControlLabel>
                                        <InputGroup>
                                            <InputGroup.Addon>
                                                <Field name="invalidita-presente" disabled={readOnly}
                                                    {...getFieldProps('invalidita.presente')}
                                                    render={(id, label, helpText, validationState, props) => (
                                                        <input id={id} type="checkbox" checked={props.value} {...props} />
                                                    )} />
                                            </InputGroup.Addon>
                                            <FormControl type="number" readOnly={readOnly
                                                || !get(form.values, 'invalidita.presente', false)}
                                                {...getFieldProps('invalidita.percentuale')} />
                                            <InputGroup.Addon>%</InputGroup.Addon>
                                        </InputGroup>
                                        {(form.getTouched('invalidita.percentuale') && form.getErrors('invalidita.percentuale')) &&
                                            <HelpBlock>{form.getErrors('invalidita.percentuale')}</HelpBlock>}
                                    </FormGroup>
                                </div>
                            </div>
                        </div>
                        {(form.hasErrors || form.hasWarnings) && <div className="row">
                            <div className="col-sm-12">
                                <ValidationSummary namespace={formNamespace} form={form} cssClass="" />
                            </div>
                        </div>}
                        <div className="row mt-2 mb-2">
                            <div className="col-sm-12 text-center">
                                <button type="submit" className="btn btn-success">
                                    {readOnly ? 'Conferma' : 'Salva'}
                                </button>
                                {!readOnly && <button onClick={form.resetForm} type="button" className="btn btn-default ml-4">Pulisci</button>}
                                <button onClick={onCancel} type="button" className="btn btn-danger ml-4">
                                    {readOnly ? 'Torna indietro' : 'Annulla inserimento'}
                                </button>
                            </div>
                        </div>
                    </div>
                )} />
            </div>
        </div>
    );
}

// #region Redux

const mapStateToProps = state => {
    return {
        // props
        // loginToken: state.loginToken,
        configurazione: state.configurazione,
        // services
        http: state.httpService,
        logger: state.loggerService
    };
};

// #endregion

export default connect(mapStateToProps)(FormAssistito);