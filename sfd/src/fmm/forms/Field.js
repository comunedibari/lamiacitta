/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';

import { FormGroup, ControlLabel, FormControl, HelpBlock, Checkbox } from 'react-bootstrap';

const Field = ({
    id,
    label,
    help,
    type,
    readOnly,
    validation,
    render,
    ...props
}) => {
    let validationState = null,
        helpText = help;

    if (validation) {
        const { error, warning, touched } = validation;
        // console.log('Field.validation => ', error, warning, touched);
        if (touched && error) {
            validationState = "error";
            helpText = error;
        } else if (touched && warning) {
            validationState = "warning";
            helpText = warning;
        }
    }

    if (typeof render === "function") {
        return render(id, label, helpText, validationState, { ...props });
    }

    let control = null;
    let controlLabel = (<ControlLabel>{label}</ControlLabel>);

    switch (type) {
        case "checkbox":
            controlLabel = null;
            control = (
                <Checkbox id={id} label={label} checked={props.value} readOnly={readOnly} validationState={validationState} disabled={readOnly} {...props}>
                    {label}
                </Checkbox>
            );
            break;
        default:
            control = (
                <FormControl label={label} placeholder={label} type={type} readOnly={readOnly} disabled={readOnly} {...props} />
            );
            break;
    }

    return (
        <FormGroup controlId={id} validationState={validationState}>
            {controlLabel}
            {control}
            {helpText && <HelpBlock>{helpText}</HelpBlock>}
        </FormGroup>
    )
}

export default Field;