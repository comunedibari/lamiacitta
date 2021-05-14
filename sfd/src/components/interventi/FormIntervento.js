/* SPDX-License-Identifier: AGPL-3.0-or-later */

import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import { ControlLabel, FormControl, FormGroup, HelpBlock, InputGroup } from 'react-bootstrap';

import { connect } from 'react-redux';

import { Form, Field, SelectField, ValidationSummary } from '../../fmm/forms';

const FormIntervento = ({ values, onSubmit, onCancel, ...props }) => {
    const readOnly = false;

    const getEndOfYear = () => {
        let d = new Date();
        d.setMonth(11);
        d.setDate(31);
        return d;
    }

    //#region Config validazione
    const formConfig = {
        fields: {
            area: {
                default: null,
                label: "Area *",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                        validazioneInterventi: props.validazioneInterventi
                    }
                }
            },
            ambito: {
                default: null,
                label: "Ambito *",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                        validazioneInterventi: props.validazioneInterventi
                    }
                }
            },
            servizio: {
                default: null,
                label: "Servizio *",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                        validazioneInterventi: props.validazioneInterventi
                    }
                }
            },
            dataInizioIntervento: {
                default: new Date().toJSON().slice(0, 10),
                label: "Data inizio intervento *",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                        gte: {
                            message: 'La data inizio non può essere inferiore a 01/01/2020.',
                            val: new Date(`2020-01-01`).toJSON().slice(0, 10)
                        },
                        lte: {
                            message: 'La data inizio non può essere superiore alla data di fine.',
                            ref: 'dataFineIntervento',
                        },
                        validazioneInterventi: props.validazioneInterventi
                    }
                }
            },
            dataFineIntervento: {
                default: getEndOfYear().toJSON().slice(0, 10),
                label: "Data fine intervento *",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                        gte: {
                            message: 'La data fine non può essere inferiore alla data di inizio.',
                            ref: 'dataInizioIntervento',
                        },
                        validazioneInterventi: props.validazioneInterventi
                    }
                }
            },
            attivitaLavorativa: {
                default: null,
                label: "Attività lavorativa *",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                    }
                }
            },
            attivitaLavorativaPrecedente: {
                default: null,
                label: "Attività lavorativa precedente *",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                    }
                }
            },
            frequenzaFruizioneServizio: {
                default: null,
                label: "Frequenza fruizione servizio *",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                    }
                }
            },
            presenzaAnziani: {
                default: false,
                label: "Presenza anziani ultra 65-enni",
                validators: null
            },
            presenzaDisabili: {
                default: false,
                label: "Presenza disabili",
                validators: null
            },
            presenzaMinori: {
                default: false,
                label: "Presenza minori",
                validators: null
            },
            numeroComponenti: {
                default: null,
                label: "Numero componenti nucleo familiare (compreso fruitore) *",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                        integer: {
                            message: 'Il campo dev\'essere un numero intero.'
                        },
                        gte: {
                            message: 'Il valore dev\'essere maggiore di 1.',
                            val: 1
                        }
                    }
                }
            },
            invalidita: {
                presente: {
                    default: false,
                    label: "Presenza invalidità",
                    validators: null
                },
                percentuale: {
                    default: 0,
                    label: "Percentuale invalidità",
                    validators: {
                        errors: {
                            requiredIf: {
                                message: 'Il campo è obbligatorio.',
                                predicate: (value, values) => {
                                    return get(values, 'invalidita.presente', false);
                                }
                            },
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
            },
            note: {
                default: null,
                label: "Note *",
                validators: {
                    errors: {
                        required: {
                            message: 'Il campo è obbligatorio.'
                        },
                    }
                }
            }
        }
    }

    //#endregion

    let texts = {
        submit: 'Salva',
        pristine: 'Pulisci',
        cancel: 'Annulla inserimento'
    };

    if (props.texts) {
        texts = {
            ...texts,
            ...props.texts
        };
    }

    const { configurazione, struttura } = props;
    const { professioni, frequenzeFruizioneServizio } = configurazione;

    const areeIntervento = struttura.areeIntervento;
    const [ambitiIntervento, setAmbitiIntervento] = useState([]);
    const [servizi, setServizi] = useState([]);

    useEffect(() => {
        props.logger.info('FormIntervento.mount');
        if (values) init();
    }, [values]);

    const init = () => {
        props.logger.info('FormIntervento.init');
        updateAreaAmbitoServizio(get(values, 'area.id'), get(values, 'ambito.id'));
    }

    const updateAreaAmbitoServizio = (idArea, idAmbito) => {
        let ambiti = [], servizi = [];

        if (idArea) {
            var area = areeIntervento.find(x => x.id === idArea);
            ambiti = get(area, 'ambiti', []);
            if (ambiti && idAmbito) {
                var ambito = ambiti.find(x => x.id === idAmbito);
                servizi = get(ambito, 'servizi', []);
            }
        }

        setAmbitiIntervento(ambiti);
        setServizi(servizi);
    }

    const onFormSubmitHandler = (form) => {
        props.logger.info('FormIntervento.onFormSubmitHandler =>', form);
        if (form.hasErrors) return;

        const response = onSubmit(form.values);
        if (response && response.result) {
            form.resetForm();
            init();
        }
    }

    const namespace = props.namespace || "formintervento";

    return (
        <div className="form-interventi__wrapper" >
            <div className="container">
                <Form namespace={namespace} values={values} config={formConfig} onFormSubmit={onFormSubmitHandler} render={(
                    form,
                    // FUNCTIONS
                    getFieldProps
                ) => {
                    return (
                        <div className="form__body">
                            {/* <pre>{JSON.stringify(form.values, null, 2)}</pre> */}
                            <div className="row">
                                <div className="col-sm-12">
                                    <SelectField readOnly={readOnly}
                                        fieldProps={getFieldProps('area')}
                                        onSelectedItem={(item) => {
                                            form.setFieldValue('area', item);
                                            updateAreaAmbitoServizio(item.id, null);
                                        }}
                                        options={areeIntervento} />
                                </div>
                                <div className="col-sm-12">
                                    <SelectField readOnly={!ambitiIntervento.length}
                                        fieldProps={getFieldProps('ambito')}
                                        onSelectedItem={(item) => {
                                            form.setFieldValue('ambito', item)
                                            updateAreaAmbitoServizio(get(form.values, 'area.id'), item.id);
                                        }}
                                        options={ambitiIntervento} />
                                </div>
                                <div className="col-sm-12">
                                    <SelectField readOnly={!servizi.length}
                                        fieldProps={getFieldProps('servizio')}
                                        onSelectedItem={(item) => form.setFieldValue('servizio', item)}
                                        options={servizi} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <Field type="date"
                                        {...getFieldProps('dataInizioIntervento')} />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Field type="date"
                                        {...getFieldProps('dataFineIntervento')} />
                                </div>
                            </div>
                            <div className="row">
                                {/*
                                <div className="col-sm-12 col-md-6">
                                    <Field type="text" {...getFieldProps('titolo')} />
                                </div>
                                */}
                                <div className="col-sm-12 col-md-6">
                                    <Field type="number"
                                        {...getFieldProps('numeroComponenti')} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <Field type="checkbox"
                                        {...getFieldProps('presenzaAnziani')} />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Field type="checkbox"
                                        {...getFieldProps('presenzaDisabili')} />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <Field type="checkbox"
                                        {...getFieldProps('presenzaMinori')} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-6">
                                    <SelectField readOnly={readOnly}
                                        fieldProps={getFieldProps('attivitaLavorativa')}
                                        onSelectedItem={(item) => form.setFieldValue('attivitaLavorativa', item)}
                                        options={professioni} />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <SelectField readOnly={readOnly}
                                        fieldProps={getFieldProps('attivitaLavorativaPrecedente')}
                                        onSelectedItem={(item) => form.setFieldValue('attivitaLavorativaPrecedente', item)}
                                        options={professioni} />
                                </div>
                                <div className="col-sm-12 col-md-6">
                                    <SelectField readOnly={readOnly}
                                        fieldProps={getFieldProps('frequenzaFruizioneServizio')}
                                        onSelectedItem={(item) => form.setFieldValue('frequenzaFruizioneServizio', item)}
                                        options={frequenzeFruizioneServizio} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12 col-md-4">
                                    <FormGroup validationState={(form.getTouched('invalidita.percentuale') && form.getErrors('invalidita.percentuale')) && 'error'}>
                                        <ControlLabel>Invalidità del fruitore</ControlLabel>
                                        <InputGroup>
                                            <InputGroup.Addon>
                                                <Field disabled={readOnly}
                                                    {...getFieldProps('invalidita.presente')}
                                                    render={(id, label, helpText, validationState, props) => (
                                                        <input onClick={() => {
                                                            if (document.getElementById("formintervento.invalidita.presente") !== "true") {
                                                                form.setFieldValue('invalidita.percentuale', "");
                                                            }
                                                        }} id={id} type="checkbox" checked={props.value} {...props} />
                                                    )} />
                                            </InputGroup.Addon>
                                            <FormControl type="number"
                                                readOnly={readOnly || !get(form.values, 'invalidita.presente', false)}
                                                {...getFieldProps('invalidita.percentuale')} />
                                            <InputGroup.Addon>%</InputGroup.Addon>
                                        </InputGroup>
                                        {(form.getTouched('invalidita.percentuale') && form.getErrors('invalidita.percentuale')) &&
                                            <HelpBlock>{form.getErrors('invalidita.percentuale')}</HelpBlock>}
                                    </FormGroup>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <Field componentClass="textarea"
                                        {...getFieldProps('note')} />
                                </div>
                            </div>
                            {(form.hasErrors || form.hasWarnings) && <div className="row">
                                <div className="col-sm-12">
                                    <ValidationSummary namespace={namespace} form={form} cssClass="" />
                                </div>
                            </div>}
                            <div className="row mt-2 mb-2">
                                <div className="col-sm-12 text-center">
                                    <button type="submit" className="btn btn-md btn-success">{texts.submit}</button>
                                    <button type="button" className="btn btn-md btn-default ml-4" onClick={() => {
                                        form.resetForm();
                                    }}>{texts.pristine}</button>
                                    <button type="button" className="btn btn-md btn-danger ml-4" onClick={onCancel} >{texts.cancel}</button>
                                </div>
                            </div>
                        </div>
                    );
                }} />
            </div>
        </div >
    );
}

// #region Redux

const mapStateToProps = state => {
    return {
        // props
        // loginToken: state.loginToken,
        struttura: state.struttura,
        configurazione: state.configurazione,
        // services
        http: state.httpService,
        logger: state.loggerService
    };
};

// #endregion

export default connect(mapStateToProps)(FormIntervento);