/* SPDX-License-Identifier: AGPL-3.0-or-later */
import { get } from 'lodash';
import React from 'react';
import { scrollElementToY } from '../../utility/uiUtilities';

const ValidationSummary = ({ namespace, form, cssClass, ...props }) => {
    const { fields, labels, getErrors, getWarnings } = form;

    const onClickHandler = (field) => {
        scrollElementToY(`${namespace}.${field}`, 120);
    }

    const errors = fields.filter((field) => {
        if (getErrors(field))
            return true;

        return false;
    }).map((field) => {
        const error = getErrors(field);
        return (
            <li key={'validation-summary__errors__' + field} onClick={() => onClickHandler(field)}>
                <span className="fakeLink">{`${get(labels, field, field)}`}</span>: {`${error}`}
            </li>
        );
    });

    const warnings = fields.filter((field) => {
        if (getWarnings(field))
            return true;

        return false;
    }).map((field) => {
        const error = getWarnings(field);
        return (
            <li key={'validation-summary__warnings__' + field} onClick={() => onClickHandler(field)}>
                <span className="fakeLink">{`${get(labels, field, field)}`}</span>: {`${error}`}
            </li>
        );
    });

    return (
        <div>
            {!!errors.length &&
                <div>
                    I seguenti errori dovranno essere corretti per procedere:
                    <div id={namespace + "__errors"} className={`alert alert-danger ${cssClass}`}>
                        <ul className="pl-3">
                            {errors}
                        </ul>
                    </div>
                </div>
            }

            {!!warnings.length &&
                <div>
                    Avvertimenti non bloccanti ma importanti:
                    <div id={namespace + "__warnings"} className={`alert alert-warning ${cssClass}`}>
                        <ul className="pl-3">
                            {warnings}
                        </ul>
                    </div>
                </div>
            }
        </div>

    );
};

export default ValidationSummary;