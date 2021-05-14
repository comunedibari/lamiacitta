/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';
import { Pagination } from 'react-bootstrap';

// props.risultati: Numero di risultati della query
// props.elementiPerPagina: Numero di elementi per singola pagina
// props.paginaCorrente: Numero di pagina attuale
// props.paginaClicked: Evento 

const Paginazione = (props) => {
    let items = null;

    if (props.risultati > props.elementiPerPagina) {
        const numeroPagine = Math.ceil(props.risultati / props.elementiPerPagina);

        switch (numeroPagine) {
            case 1:
                return (<Pagination>
                    <Pagination.Item active>1</Pagination.Item>
                </Pagination>);

            case 2:
                return (<Pagination>
                    <Pagination.Item
                        onClick={() => { props.paginaClicked(1); }}
                        active={props.paginaCorrente === 1 ? true : false}>1</Pagination.Item>
                    <Pagination.Item
                        onClick={() => { props.paginaClicked(2); }}
                        active={props.paginaCorrente === 2 ? true : false}>2</Pagination.Item>
                </Pagination>);

            case 3:
                return (<Pagination>
                    <Pagination.Item
                        onClick={() => { props.paginaClicked(1); }}
                        active={props.paginaCorrente === 1 ? true : false}>1</Pagination.Item>
                    <Pagination.Item
                        onClick={() => { props.paginaClicked(2); }}
                        active={props.paginaCorrente === 2 ? true : false}>2</Pagination.Item>
                    <Pagination.Item
                        onClick={() => { props.paginaClicked(3); }}
                        active={props.paginaCorrente === 3 ? true : false}>3</Pagination.Item>
                </Pagination>);

            default:
                let minore = null;
                let maggiore = null;
                let ellissiSX = null;
                let ellissiDX = null;
                let pagPrecedente = null;
                let pagSuccessiva = null;
                let paginaCorrente = <Pagination.Item active>{props.paginaCorrente}</Pagination.Item>;

                if (props.paginaCorrente > 1) {
                    minore = <Pagination.Prev onClick={() => { props.paginaClicked(props.paginaCorrente - 1); }} />;
                    pagPrecedente = <Pagination.Item onClick={() => { props.paginaClicked(props.paginaCorrente - 1); }}>{props.paginaCorrente - 1}</Pagination.Item>;
                }

                if (props.paginaCorrente < numeroPagine) {
                    maggiore = <Pagination.Next onClick={() => { props.paginaClicked(props.paginaCorrente + 1); }} />;
                    pagSuccessiva = <Pagination.Item onClick={() => { props.paginaClicked(props.paginaCorrente + 1); }} >{props.paginaCorrente + 1}</Pagination.Item>;
                }

                if (props.paginaCorrente > 2) {
                    ellissiSX = (
                        <React.Fragment>
                            <Pagination.Item onClick={() => { props.paginaClicked(1); }} >{1}</Pagination.Item>
                            <Pagination.Ellipsis />
                        </React.Fragment>
                    );
                }

                if (props.paginaCorrente < numeroPagine - 1) {
                    ellissiDX = (
                        <React.Fragment>
                            <Pagination.Ellipsis />
                            <Pagination.Item onClick={() => { props.paginaClicked(numeroPagine); }} >{numeroPagine}</Pagination.Item>
                        </React.Fragment>
                    );
                }

                items = (
                    <Pagination>
                        {minore} {ellissiSX} {pagPrecedente} {paginaCorrente} {pagSuccessiva} {ellissiDX} {maggiore}
                    </Pagination>
                );

                return items;
        }
    } else {
        return null;
    }

}

export default Paginazione;