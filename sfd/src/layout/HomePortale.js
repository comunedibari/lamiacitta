/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React, { Component, Fragment } from 'react';

import { withRouter, NavLink } from 'react-router-dom';

import { connect } from 'react-redux';
import * as actions from '../redux/actions';

import { scaleDown as Menu } from 'react-burger-menu';

import HeaderPortale from './HeaderPortale';
import FooterPortale from './FooterPortale';

import ModaleLogin from '../components/ModaleLogin';
import ModaleErroreLogin from '../components/ModaleErroreLogin';
import ModaleModificaPassword from '../components/ModaleModificaPassword';
import ModaleErroreScaricamentoConfigurazione from '../components/ModaleErroreScaricamentoConfigurazione';

import './burgermenu.css';

class HomePortale extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visualizzaLogin: false,
            visualizzaModificaPassword: false,
            visualizzaModaleErroreLogin: false,
        };
    }

    // #region Eventi della classe
    chiudiModaleClicked = () => {
        this.setState({
            visualizzaLogin: false,
            visualizzaModificaPassword: false,
            visualizzaModaleErroreLogin: false,
        });
    }

    chiudiModaleErroreConfigurazioneClicked = () => {
        this.props.scaricaConfigurazione();
    }

    accediClicked = () => {
        if (this.props.userProfile === null || this.props.userProfile.username === "") {
            this.setState({
                visualizzaLogin: true,
                visualizzaModaleErroreLogin: false,
            });
        } else {
            this.props.effettuaLogout();
        }
    }

    loginClicked = (username, password) => {
        this.props.effettuaLogin(username, password);
    }
    // #endregion Eventi della classe

    // #region Eventi del ciclo di vita del componente React
    getSnapshotBeforeUpdate = (prevProps, prevState) => {
        // Il token di login è cambiato, ma è stato resettato. Succede al logout
        if (this.props.loginToken !== prevProps.loginToken &&
            this.props.messaggioErroreLogin === null &&
            this.props.loginToken === null) {
            return "logout";
        }

        // E' stato effettuato un login con successo (anche utente internet generico)
        if (this.props.loginToken !== prevProps.loginToken &&
            this.props.messaggioErroreLogin === null) {
            return "login_ok";
        }

        // E' stato effettuato un login con successo ma dobbiamo modificare la password
        if (this.props.codiceErroreLogin === 301 || this.props.codiceErroreLogin === 302) {
            if (this.state.visualizzaModificaPassword === false) {
                return "cambia_password";
            } else {
                return null;
            }
        }

        // E' stato effettuato un login con errore (anche utente internet generico)
        if (this.props.messaggioErroreLogin !== prevProps.messaggioErroreLogin &&
            this.props.messaggioErroreLogin !== null) {
            return "login_errore";
        }

        return null;
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (snapshot === null) {
            return;
        }

        if (snapshot === "logout") {
            this.setState({
                visualizzaLogin: false,
                visualizzaModificaPassword: false,
                visualizzaModaleErroreLogin: false,
            });
        }

        if (snapshot === "login_ok") {
            this.setState({
                visualizzaLogin: false,
                visualizzaModificaPassword: false,
                visualizzaModaleErroreLogin: false,
            });
        }

        if (snapshot === "cambia_password") {
            this.setState({
                visualizzaLogin: false,
                visualizzaModificaPassword: true,
                visualizzaModaleErroreLogin: false,
            });
        }

        if (snapshot === "login_errore") {
            this.setState({
                visualizzaLogin: false,
                visualizzaModificaPassword: false,
                visualizzaModaleErroreLogin: true,
            });
        }

        // Non abbiamo ancora scaricato la configurazione
        if (!!this.props.loginToken
            && !this.props.configurazione
            && !this.props.messaggioErroreConfigurazione) {
            this.props.scaricaConfigurazione();
        }
    }

    componentDidMount = () => {
        if (!this.props.loginToken) {
            this.props.effettuaLogin("", ""); // utente internet generico
        } else if (!this.props.configurazione) {
            this.props.scaricaConfigurazione();
        }
    }
    //#endregion

    render() {
        const { userProfile } = this.props;

        const nomeUtente = (!userProfile || !userProfile.username ? "Accedi" :
            `Logout ${userProfile.nome} ${userProfile.cognome}`);

        let centrale = null;
        if (this.state.visualizzaModificaPassword === true) {
            centrale = <Fragment>
                <span style={{ height: "300px", display: "block" }}>&nbsp;</span>
                <ModaleModificaPassword cambioPasswordConSuccesso={this.cambioPasswordConSuccesso} chiudiModaleClicked={this.chiudiModaleClicked} />
            </Fragment>;
        }

        if (this.state.visualizzaLogin === true) {
            centrale = <Fragment>
                <span style={{ height: "300px", display: "block" }}>&nbsp;</span>
                <ModaleLogin loginClicked={this.loginClicked} chiudiModaleClicked={this.chiudiModaleClicked} />
            </Fragment>;
        }

        if (this.state.visualizzaModaleErroreLogin === true) {
            centrale = <Fragment>
                <span style={{ height: "300px", display: "block" }}>&nbsp;</span>
                <ModaleErroreLogin messaggioErrore={this.props.messaggioErroreLogin} chiudiModaleClicked={this.chiudiModaleClicked} />
            </Fragment>;
        }

        if (this.props.messaggioErroreConfigurazione !== null) {
            centrale = <Fragment>
                <span style={{ height: "300px", display: "block" }}>&nbsp;</span>
                <ModaleErroreScaricamentoConfigurazione messaggioErrore={this.props.messaggioErroreConfigurazione}
                    chiudiModaleClicked={this.chiudiModaleErroreConfigurazioneClicked} />
            </Fragment>;
        }

        const menuClicked = () => {
            Array.prototype.slice.call(document.getElementsByClassName("bm-burger-button")[0].children)
                .filter((item) => { return item.localName === "button" })[0].click();
        }

        return (
            <div id="outer-container">
                <Menu burgerButtonClassName={"bm-burger-button"}
                    burgerBarClassName={"bm-burger-bars"}
                    crossButtonClassName={"bm-cross-button"}
                    crossClassName={"bm-cross"}
                    menuClassName={"bm-menu"}
                    morphShapeClassName={"bm-morph-shape"}
                    itemListClassName={"bm-item-list"}
                    overlayClassName={"bm-overlay"}>
                    <div className="side-menu-container">
                        <ul id="nav-main" className="nav navbar-nav navmenu">
                            <li className="area" id="Area_18994">
                                <span className="spanArea" onClick={menuClicked}><NavLink to="/">Home</NavLink></span>
                            </li>
                        </ul>
                    </div>
                </Menu>
                <main id="page-wrap">
                    <div id="overlay" className="hidden"></div>
                    <div id="boxTotale" className="home">
                        <HeaderPortale nomeUtente={nomeUtente} accediClicked={this.accediClicked} />
                        <main className="main_container" id="corpo">
                            {centrale === null ? this.props.children : centrale}
                        </main>
                        <FooterPortale />
                    </div>
                </main>
            </div>
        );
    }
}


// #region Redux

const mapStateToProps = state => {
    return {
        loginToken: state.loginToken,
        userProfile: state.userProfile,
        configurazione: state.configurazione,
        operatore: state.operatore,
        struttura: state.struttura,
        codiceErroreLogin: state.codiceErroreLogin,
        messaggioErroreLogin: state.messaggioErroreLogin,
        messaggioErroreConfigurazione: state.messaggioErroreConfigurazione
    };
};

const mapDispatchToProps = dispatch => {
    return {
        effettuaLogin: (username, password) => dispatch(actions.effettuaLogin(username, password)),
        effettuaLogout: () => dispatch(actions.effettuaLogout()),
        scaricaConfigurazione: () => dispatch(actions.scaricaConfigurazione())
    }
};

// #endregion


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePortale));
