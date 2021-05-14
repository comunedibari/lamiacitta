/* SPDX-License-Identifier: AGPL-3.0-or-later */
import { get } from 'lodash';
import React from 'react';

import { ControlLabel, FormControl, FormGroup, HelpBlock } from 'react-bootstrap';

import Field from './Field';

const SelectField = ({
    id,
    label,
    help,
    options = [],
    fieldProps,
    readOnly,
    onSelectedItem,
    ...props
}) => {
    let selectedValue = get(fieldProps, 'value.id', '');

    const onItemChangeHandler = (e) => {
        // TODO == ?
        // eslint-disable-next-line
        const item = options.find(x => x.id == e.target.value);
        if (typeof onSelectedItem === "function")
            onSelectedItem(item);
    }

    return (
        <Field id={id} label={label} help={help} {...fieldProps}
            render={(id, label, helpText, validationState, props) => {
                let control = (
                    <FormControl id={id} name={id} componentClass="select" readOnly={readOnly} disabled={readOnly} value={selectedValue}
                        onChange={(e) => onItemChangeHandler(e)}>
                        <option value="">--Seleziona un valore--</option>
                        {(options.length) && options.map(x => (
                            <option key={id + '--' + x.id} value={x.id}>
                                {x.nome}
                            </option>
                        ))}
                    </FormControl>
                );

                return (
                    <FormGroup controlId={id} validationState={validationState} style={{ position: 'relative' }}>
                        <ControlLabel>{label}</ControlLabel>
                        {control}
                        {helpText && <HelpBlock>{helpText}</HelpBlock>}
                    </FormGroup>
                );
            }} />
    );
}

export default SelectField;