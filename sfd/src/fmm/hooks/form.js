/* SPDX-License-Identifier: AGPL-3.0-or-later */
import { useEffect, useReducer } from 'react';

import { get, set, isNil } from 'lodash';

import isInt from 'validator/lib/isInt';
import isEmail from 'validator/lib/isEmail';
import matches from 'validator/lib/matches';
import isLength from 'validator/lib/isLength';

//#region VALIDATORS
const VALIDATORS = {
    required: (value, config, values) => {
        const { message, disabled } = config;
        if (disabled) return null;

        return !value || value === '' ? message : null;
    },
    requiredIf: (value, config, values) => {
        const { message, disabled, predicate } = config;

        if (!disabled && typeof predicate === 'function') {
            return predicate(value, values) && !value ? message : null;
        }
        else return null;
    },
    requiredIfEmpty: (value, config, values) => {
        const { message, disabled, refs } = config;
        if (disabled) return null;

        let isRequired = false;
        for (const ref of refs) {
            if (!get(values, ref)) {
                isRequired = true;
                break;
            }
        }
        return isRequired && (!value || value === '') ? message : null;
    },
    isEmail: (value, config, values) => {
        const { message, disabled } = config;
        if (disabled) return null;

        return !value || isEmail(value) ? null : message;
    },
    pattern: (value, config, values) => {
        const { message, disabled, regex } = config;
        if (disabled) return null;

        return !value || matches(value, new RegExp(regex)) ? null : message;
    },
    integer: (value, config, values) => {
        const { message, disabled } = config;
        if (disabled) return null;

        return !value || isInt(`${value}`) ? null : message;
    },
    length: (value, config, values) => {
        const { message, disabled, min, max } = config;
        if (disabled || !value) return null;

        return isLength(value, { min: min, max: max }) ? null : message;
    },
    range: (value, config, values) => {
        const { message, disabled, min, max } = config;
        if (disabled) return null;

        return value >= min && value <= max ? null : message;
    },
    gt: (value, config, values) => {
        const { message, disabled, val, ref } = config;
        if (disabled || !value || (isNil(val) && !ref)) return null;

        let valid = true;
        if (ref) {
            const refValue = get(values, ref);
            if (!refValue) valid = true;
            else valid = value > refValue;
        }

        if (valid && !isNil(val)) {
            valid = value > val;
        }

        return valid ? null : message;
    },
    lt: (value, config, values) => {
        const { message, disabled, val, ref } = config;
        if (disabled || !value || (isNil(val) && !ref)) return null;

        let valid = true;
        if (ref) {
            const refValue = get(values, ref);
            if (!refValue) valid = true;
            else valid = value < refValue;
        }

        if (valid && !isNil(val)) {
            valid = value < val;
        }

        return valid ? null : message;
    },
    equals: (value, config, values) => {
        const { message, disabled, val, ref, strict } = config;
        if (disabled || !value || (isNil(val) && !ref)) return null;

        let valid = true;
        if (ref) {
            const refValue = get(values, ref);
            if (!refValue) valid = true;
            // eslint-disable-next-line
            else valid = (strict ? value === refValue : value == refValue);
        }

        if (valid && !isNil(val)) {
            // eslint-disable-next-line
            valid = (strict ? value === val : value == val);
        }

        return valid ? null : message;
    },
    gte: (value, config, values) => {
        const { message, disabled, val, ref } = config;
        if (disabled || !value || (isNil(val) && !ref)) return null;

        let valid = true;
        if (ref) {
            const refValue = get(values, ref);
            if (!refValue) valid = true;
            else valid = value >= refValue;
        }

        if (valid && !isNil(val)) {
            valid = value >= val;
        }

        return valid ? null : message;
    },
    lte: (value, config, values) => {
        const { message, disabled, val, ref } = config;
        if (disabled || !value || (isNil(val) && !ref)) return null;

        let valid = true;
        if (ref) {
            const refValue = get(values, ref);
            if (!refValue) valid = true;
            else valid = value <= refValue;
        }

        if (valid && !isNil(val)) {
            valid = value <= val;
        }

        return valid ? null : message;
    }
};
//#endregion

function validateField(value = '', rules, values) {
    // console.log('validation.validateField => ', value, validator, values);
    for (let ruleName in rules) {
        // console.log('validation.validateField ruleName => ', ruleName);
        const rule = rules[ruleName];
        if (!rule) continue;

        let message = null;
        if (typeof rule === "function")
            message = rule(value, values);
        else {
            message = VALIDATORS[ruleName](value, rule, values);
        }

        if (message) {
            return message;
        }
    }
    return null;
}

function validateFields(state, fields) {
    const { values } = state;
    // console.log('validation.validateFields => ', values, fields);
    const errors = {};
    const warnings = {};

    if (!state.disableValidation) {
        for (let field of state.fields) {
            const value = get(values, field);

            const errorValidationRules = get(fields, field + '.validators.errors');
            const warningValidationRules = get(fields, field + '.validators.warnings');

            // console.log('validation.validateFields => ', value, field, errorValidationRules, warningValidationRules);
            if (errorValidationRules) {
                const error = validateField(value, errorValidationRules, values);
                set(errors, field, error);
            }

            if (warningValidationRules) {
                const warning = validateField(value, warningValidationRules, values);
                set(warnings, field, warning);
            }
        }
    }

    // console.log('validation.validateFields => ', errors, warnings);
    return { errors, warnings };
}

function propertiesToArray(obj) {
    const isObject = val =>
        typeof val === 'object' && !Array.isArray(val);

    const addDelimiter = (a, b) =>
        a ? `${a}.${b}` : b;

    const paths = (obj = {}, head = '') => {
        return Object.entries(obj)
            .reduce((product, [key, value]) => {
                let fullPath = addDelimiter(head, key)
                switch (key) {
                    case 'label':
                    case 'validators':
                    case 'default':
                        return head;
                    default:
                        return isObject(value) ?
                            product.concat(paths(value, fullPath))
                            : product.concat(fullPath)
                }
            }, []);
    }

    return paths(obj);
}

function init({ initialValues, config }) {

    const INITIAL_STATE = {
        disableValidation: false,
        namespace: "",
        fields: [],
        labels: {},
        values: {},
        errors: {},
        warnings: {},
        touched: {},
        isValid: false,
        hasErrors: false,
        hasWarnings: false,
        submitCount: 0,
        submitted: false
    };

    // Init values
    INITIAL_STATE.fields = propertiesToArray(config.fields);
    INITIAL_STATE.values = {
        ...initialValues,
        ...INITIAL_STATE.fields.reduce((o, k) => (
            set(o, k, get(initialValues, k, get(config.fields, k + '.default')))
        ), {})
    };

    INITIAL_STATE.labels = {
        ...INITIAL_STATE.fields.reduce((o, k) => (
            set(o, k, get(config.fields, k + '.label'))
        ), {})
    };

    INITIAL_STATE.disableValidation = get(config, 'disableValidation', false);

    INITIAL_STATE.namespace = config.namespace || "";

    return INITIAL_STATE;
}

function formReducer(state, action) {
    switch (action.type) {
        case 'change':
            const { fieldName, fieldValue } = action.payload;

            const touched = set({ ...state.touched }, fieldName, true);
            const values = set({ ...state.values }, fieldName, fieldValue);
            return {
                ...state,
                values,
                touched
            };

        case 'submit':
            return {
                ...state,
                touched: state.fields.reduce((o, k) => (set(o, k, true)), {}),
                submitCount: state.submitCount + 1,
                submitted: true
            };

        case 'reset':
            return init(action.payload); // contiene initialValues

        case 'validate':
            const { errors, warnings } = action.payload;

            const _errors = { ...state.errors, ...errors };
            const hasErrors = state.fields.some(x => get(_errors, x));

            const _warnings = { ...state.warnings, ...warnings };
            const hasWarnings = state.fields.some(x => get(_warnings, x));

            return {
                ...state,
                errors: _errors,
                hasErrors: hasErrors,
                isValid: !hasErrors,
                warnings: _warnings,
                hasWarnings: hasWarnings,
            };

        default:
            throw new Error('Unknown action type');
    }
}

export const useForm = (initialValues, config) => {
    const [state, dispatch] = useReducer(formReducer, { initialValues, config }, init);

    const { fields, onFormSubmit } = config;

/*  Note importanti di carattere generale:

    1) Gli initialValues passati alla form corrispondono esattamente come struttura
       a form.values restituito dalla form

    2) validazione: - validators.errors sono i validatori di errori
                    - validators.warnings sono i validatori di warning
                    - validators.errors e validators.warnings hanno la stessa struttura
                    - è possibile passare una validazione custom inserendo una key custom
                      a validators.errors e validators.warnings
                    - l'elenco degli errori si può inserire nella form in questo modo:
                      <ValidationSummary namespace={formConfig.namespace} form={form} cssClass="" />


    Esempio fields:

    fields: [
        "cognome",
        "nome",
        "codiceFiscale",
        "dataIntervento.inizio",
        "dataIntervento.fine",
        "area", // area è di tipo composto: potrebbe essere un Autocomplete o una Select
        "invalidita", // imvalidità è di tipo checkbox
        "percentualeinvalidita", // di tipo input numerico
    ]

    Esempio values:

    values: {
        codiceFiscale: "CLS92",
        cognome: undefined,
        dataIntervento: {
            fine: undefined,
            inizio: undefined,
        },
        nome: undefined,
        area: {
            id: 12,
            nome: "pippo"
        },
        invalidita: true,
        percentualeinvalidita: 34
    }

    Esempio labels:

    labels: {
        codiceFiscale: "Codice fiscale",
        cognome: "Cognome",
        dataIntervento: {
            fine: "Data fine",
            inizio: "Data inizio",
        },
        nome: "Nome",
        area: "Area",
        invalidita: "Invalidità",
        percentualeinvalidita: "Percentuale di invalidità"
    }
*/

    const form = {
        // PROPERTIES
        fields: state.fields,
        labels: state.labels,
        values: state.values,
        isValid: state.isValid,
        hasErrors: state.hasErrors,
        hasWarnings: state.hasWarnings,
        submitted: state.submitted,
        // GET / SET
        getValue: fieldName => {
            return fieldName ? get(state.values, fieldName, null) : null;
        },
        getTouched: fieldName => {
            return fieldName ? get(state.touched, fieldName) : state.touched;
        },
        getErrors: fieldName => {
            return fieldName ? get(state.errors, fieldName) : state.errors;
        },
        getWarnings: fieldName => {
            return fieldName ? get(state.warnings, fieldName) : state.warnings;
        },
        setFieldValue: (fieldName, fieldValue) => {
            if (state.fields.indexOf(fieldName) === -1)
                return;

            dispatch({
                type: 'change', payload: { fieldName: fieldName, fieldValue: fieldValue }
            });
        },
        // HANDLERS
        resetForm: e => {
            e && e.preventDefault();
            dispatch({ type: 'reset', payload: { initialValues, config } });
        }
    }

    useEffect(() => {
        if (!state.submitted)
            return;

        if (typeof onFormSubmit === 'function')
            onFormSubmit(form);
    }, [state.submitCount]);

    useEffect(() => {
        const { errors, warnings } = validateFields(state, fields);
        dispatch({ type: 'validate', payload: { errors, warnings } });
    }, [state.values, fields]);

    const submitForm = e => {
        e.preventDefault();
        dispatch({ type: 'submit', payload: {} });
    }

    return {
        // PROPERTIES
        form: form,
        // FUNCTIONS
        formProps: {
            onSubmit: submitForm,
            id: state.namespace,
            name: state.namespace,
        },
        getFieldProps: fieldName => ({
            onChange: e => {
                // console.log(state.fields, fieldName);
                if (state.fields.indexOf(fieldName) === -1)
                    return;

                let fieldValue = null;
                switch (e.target.type) {
                    case 'number':
                        fieldValue = +e.target.value;
                        break;
                    case 'checkbox':
                        fieldValue = e.target.checked;
                        break;
                    default:
                        fieldValue = e.target.value || '';
                        break;
                }

                dispatch({
                    type: 'change', payload: { fieldName: fieldName, fieldValue: fieldValue }
                });
            },
            id: state.namespace ? state.namespace + "." + fieldName : fieldName,
            name: state.namespace ? state.namespace + "." + fieldName : fieldName,
            label: get(state.labels, fieldName),
            value: get(state.values, fieldName) || '',
            validation: {
                touched: get(state.touched, fieldName),
                error: get(state.errors, fieldName),
                warning: get(state.warnings, fieldName)
            }
        })
    };
};