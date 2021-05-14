/* SPDX-License-Identifier: AGPL-3.0-or-later */
import { get } from 'lodash';
import React from 'react';
import SortCell from './SortCell';

const Grid = ({ data, sort, children, onSortChange, ...props }) => {
    const sortChangeHandler = (e, field) => {
        e.preventDefault();

        const ordinamento = { ...sort };
        if (ordinamento.field === field) {
            ordinamento.asc = !ordinamento.asc;
        } else {
            ordinamento.field = field;
            ordinamento.asc = false;
        }

        if (typeof onSortChange === "function")
            onSortChange(ordinamento);
    }

    let fields = [], header = [];

    // TODO: extract function
    React.Children.forEach(children, child => {
        if (React.isValidElement(child)) {
            const { title, field, sortable, render } = child.props;

            fields.push({
                key: field,
                render: render
            });

            let cellValue = title;
            if (sort && sortable) {
                cellValue = <SortCell label={title} field={field} current={sort}
                    onSortChange={sortChangeHandler}></SortCell>;
            }

            const cell = (
                <th key={'grid-header-' + field}>
                    {cellValue}
                </th>
            );

            header.push(cell);
        }
    });

    const rows = data.map((row, i) =>
        <tr key={'grid-row-' + i}>
            {fields.map((cell, j) => {
                const { key, render } = cell;
                let value = get(row, key);
                if (render) {
                    value = render({ item: row, index: i, value });
                }
                return (
                    <td key={'grid-row-cell-' + j}>
                        {value || '--'}
                    </td>
                );
            })}
        </tr>
    );

    return (
        <table className="table table-striped table-responsive table-hover">
            <thead>
                <tr>
                    {header}
                </tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export default Grid;