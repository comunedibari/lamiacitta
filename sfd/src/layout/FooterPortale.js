/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';
import { Link } from "react-router-dom";

const FooterPortale = (props) => {
    return (
        <footer className="footer_container" id="FooterContainter">
            <div id="formid_fondo2">
                <div className="container">
                    <div className="row">
                        <div className="logo-nome-ente col-xs-12">
                            <Link to="/" alt={process.env.REACT_APP_TITLE + " - Torna alla homepage"}>
                                <h3>
                                    <span className="logo-wrapper">
                                        <img className="logo" src={process.env.PUBLIC_URL + "/img/logo/logo-ente.png"} alt={process.env.REACT_APP_TITLE} />
                                    </span>
                                    <span className="nome-wrapper">{process.env.REACT_APP_TITLE}</span>
                                </h3>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div id="formid_fondo3">
                <div className="container">
                    <div className="recapiti row col-xs-12 col-sm-8">
                        <div className="col-xs-12">
                            <span className="h3">Contatti</span>
                            <div dangerouslySetInnerHTML={{ __html: process.env.REACT_APP_CONTATTI }} ></div>
                        </div>
                    </div>
                    <div className="social row col-xs-12 col-sm-4">
                        <div style={{ display: "none" }} className="nav-social col-xs-12">
                            <span className="h3">Seguici su</span>
                            <ul className="list-inline social-list">
                                <li>
                                    <a target="_blank" rel="noopener noreferrer" title="Seguici su Youtube - Questo link si aprirà in una nuova finestra" href="https://www.youtube.com/user/AmbitoPordenone/channels">
                                        <span className="fa fa-youtube" aria-hidden="true"></span>
                                        <span className="hidden">Youtube</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-xs-12">
                            <span className="h3">Credits</span>
                            <p>Sito web realizzato da <a href="http://www.progettidiimpresa.it" title="Progetti di Impresa S.r.l. - Il sito web si aprirà in una nuova finestra">Progetti di Impresa S.r.l.</a> © 2019</p>
                        </div>
                    </div>
                    <div id="users-device-size">
                        <div id="xs" className="visible-xs"></div>
                        <div id="sm" className="visible-sm"></div>
                        <div id="md" className="visible-md"></div>
                        <div id="lg" className="visible-lg"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default FooterPortale;
