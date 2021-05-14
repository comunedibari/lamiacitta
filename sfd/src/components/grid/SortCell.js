/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';
import { Glyphicon } from 'react-bootstrap';

const SortCell = ({ current, field, label, onSortChange, ...props }) => {
    let sorting = null;
    if (current.field === field) {
        sorting = (
            <span className="ml-2">
                <Glyphicon glyph={current.asc ? 'chevron-up' : 'chevron-down'}></Glyphicon>
            </span>);
    }

    return (
        <span onClick={(e) => onSortChange(e, field)} className="table__head--sort">
            {label}{sorting}
        </span>
    );
}

export default SortCell;