/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React, { useEffect, useReducer, useRef, useState } from 'react';

import { debounce, get } from 'lodash';
import { connect } from 'react-redux';

import { FormGroup, ControlLabel, FormControl, HelpBlock, ListGroup, ListGroupItem, InputGroup, Glyphicon, Button } from 'react-bootstrap';
import Field from './Field';

const INITIAL_STATE = {
    items: null,
    error: null,
    hasError: false,
    isLoading: false
};

function autocompleteReducer(state, action) {
    switch (action.type) {
        case "RESET":
            return { ...INITIAL_STATE }
        case "FETCH_START":
            return {
                ...state,
                isLoading: true,
                hasError: false,
            }
        case "FETCH_SUCCESS":
            return {
                ...state,
                isLoading: false,
                error: null,
                hasError: false,
                items: action.payload,
            }
        case "FETCH_FAILURE":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
                hasError: true,
            }
        default:
            throw new Error()
    }
}

async function ricercaValori(http, tipo, query, cancelToken, dispatch) {
    dispatch({ type: "FETCH_START" });
    try {
        const data = await http.request('ricercaValori', {
            ricerca: query + '%',
            tipo: tipo
        }, { cancelToken });

        const items = get(data, 'items', []);
        dispatch({ type: "FETCH_SUCCESS", payload: items.slice(0, 10) });
    } catch ({ code, message, data }) {
        dispatch({ type: "FETCH_FAILURE", payload: message });
    }
}

const AutocompleteField = ({
    id,
    label,
    help,
    fieldProps,
    readOnly,
    onSelectedItem,
    ...props
}) => {
    const selectedItem = get(fieldProps, 'value');

    //#region AUTOCOMPLETE STATE
    const [{ items, error, hasError, isLoading }, dispatch] = useReducer(autocompleteReducer, INITIAL_STATE);

    const [query, setQuery] = useState('');
    const [cursor, setCursor] = useState(null);
    const [focused, setFocused] = useState(false);

    const { http, resource } = props;

    const debouncedRicercaValori = useRef(
        debounce((query, cancelToken) => {
            ricercaValori(http, resource, query, cancelToken, dispatch);
        }, 350)
    ).current;

    useEffect(() => {
        const { cancel, token } = http.getCancelToken();
        if (query.length > 2) {
            debouncedRicercaValori(query, token);
        }
        return () => cancel("No longer latest query") || debouncedRicercaValori.cancel();
    }, [debouncedRicercaValori, query]);
    //#endregion

    //#region EVENT HANDLERS
    const onFocusHandler = (e) => {
        // console.log('AutocompleteField.onFocusHandler =>', e);
        setFocused(true);
    }

    const onBlurHandler = (e) => {
        // console.log('AutocompleteField.onBlurHandler =>', e);
        setFocused(false);
    }

    const onKedDownHandler = (e) => {
        if (focused && items && items.length) {
            let index = (cursor !== null ? cursor : -1);
            switch (e.key) {
                case 'ArrowUp':
                    index = index - 1;
                    break;
                case 'ArrowDown':
                    index = index + 1;
                    break;
                case 'Enter':
                    onItemChangeHandler(items[cursor]);
                    break;
                default: break;
            }
            if (index >= items.length)
                index = items.length - 1;
            else if (index < 0)
                index = 0;
            setCursor(index);
        }
    }

    const onChangeHandler = (e) => {
        // console.log('AutocompleteField.onChangeHandler =>', e);
        setQuery(e.target.value);
    }

    const onItemChangeHandler = (item) => {
        // console.log('AutocompleteField.onItemChangeHandler =>', item);
        setQuery('');
        setCursor(null);
        dispatch({ type: 'RESET' });
        if (typeof onSelectedItem === "function")
            onSelectedItem(item);
    }
    //#endregion

    let control = null;
    if (readOnly) {
        control = (<FormControl type="text" value={get(selectedItem, 'nome', '--')} readOnly={true} disabled={true} />);
    }
    else if (selectedItem) {
        control = (
            <InputGroup>
                <FormControl.Static id={id}>{selectedItem.nome}</FormControl.Static>
                <InputGroup.Button>
                    <Button bsStyle="warning" onClick={() => onItemChangeHandler(null)}>
                        <Glyphicon glyph="erase" />
                    </Button>
                </InputGroup.Button>
            </InputGroup>
        )
    } else {
        //#region LIST ITEMS
        let listItems = null;
        if (isLoading) {
            listItems = (
                <ListGroupItem className="text-center">Caricamento in corso...</ListGroupItem>
            );
        } else if (!items) {
            listItems = (
                <ListGroupItem>Scrivere 3 lettere per iniziare la ricerca</ListGroupItem>
            );
        } else if (hasError || !items.length) {
            listItems = (
                <ListGroupItem className="text-center">
                    {error || 'La ricerca non ha prodotto risultati'}
                </ListGroupItem>
            )
        } else if (items.length) {
            listItems = items.map((item, i) =>
                <ListGroupItem key={`autocomplete__item--${i}`} active={cursor === i}
                    onMouseDown={() => onItemChangeHandler(item)}>
                    {item.nome}
                </ListGroupItem>
            );
        }
        //#endregion

        control = (
            <span>
                <FormControl placeholder={label} type="text" autoComplete="off" value={query}
                    onChange={(e) => onChangeHandler(e)}
                    onFocus={(e) => onFocusHandler(e)}
                    onBlur={(e) => onBlurHandler(e)}
                    onKeyDown={(e) => onKedDownHandler(e)} />
                {
                    focused && (
                        <ListGroup style={{ position: 'absolute', zIndex: 2, width: '100%' }}>
                            {listItems}
                        </ListGroup>
                    )
                }
            </span>
        );
    }

    return (
        <Field id={id} label={label} help={help} {...fieldProps}
            render={(id, label, helpText, validationState, props) => {
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

export default connect(mapStateToProps)(AutocompleteField);