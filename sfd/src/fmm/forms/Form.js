/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';

import { useForm } from '../hooks/form';

const Form = ({ values, config, readOnly, namespace, onFormSubmit, render, ...props }) => {
    const formConfig = {
        ...config,
        disableValidation: readOnly,
        namespace: namespace,
        onFormSubmit: onFormSubmit
    }

    const {
        form,
        formProps,
        getFieldProps
    } = useForm(values, formConfig);

    const content = render(form, getFieldProps);
    const { id, name, onSubmit } = formProps;

    return (
        <div className="form__wrapper">
            <form id={id} name={name} onSubmit={onSubmit}>
                {content}
            </form>
        </div>
    );
};

export default Form;