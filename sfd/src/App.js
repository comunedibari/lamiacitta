/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React, { Component } from 'react';

import { connect } from 'react-redux';
import * as actions from './redux/actions';

import { Redirect, Route, Switch, withRouter } from "react-router-dom";

import i18n from "i18next";
import { translations } from './i18n/translations';

import { Row, Grid, Col } from 'react-bootstrap';

import { RicercaInterventi, NuovoIntervento, ModificaIntervento } from './containers/interventi';

import './css/general.css';
import Auth from './containers/auth/Auth';

import * as uiutils from './utility/uiUtilities';


class App extends Component {
  constructor(props) {
    super(props);
    // const lng = (navigator.language || navigator.userLanguage).substr(0, 2).toLowerCase();

    i18n.init({
      resources: translations,
      lng: 'it',
      fallbackLng: 'it',
      load: 'all',
      nonExplicitSupportedLngs: true,
    }).then((t) => {
      this.props.setI18n(i18n);
    }).catch((err) => {
      this.props.logger.info('Errore: ' + JSON.stringify(err));
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
      this.props.logger.info('location modificata: ' + JSON.stringify(this.props.location));
    }
  }

  onRouteChanged = () => {
    this.props.logger.info("App.onRouteChanged", this.props.match, this.props.location);
    uiutils.scrollToTop(this.props.logger);
  }

  render() {
    if (this.props.i18n === null) {
      return null;
    }

    let routes = null;
    if (this.props.isLoggedIn) {
      routes = [
        <Route key="home" exact path="/" component={RicercaInterventi} />,
        <Route key="nuovo-intervento" path="/interventi/nuovo" component={NuovoIntervento} />,
        <Route key="modifica-intervento" path="/interventi/:id" component={ModificaIntervento} />
      ]
    } else {
      routes = [
        <Route key="home" exact path="/" render={() => {
          return (
            <Grid fluid={true}>
              <Row>
                <Col xs={12}>
                  <div style={{ display: "block", height: "auto", minHeight: "300px", textAlign: "center" }}>
                    <h2>Benvenuti sulla pagina dedicata all'inserimento dei servizi a fruizione diffusa.</h2>
                    <span>
                      Per poter iniziare il lavoro di inserimento dei servizi a fruizione diffusa è necessario effettuare il login utilizzando il pulsante ACCEDI in alto a destra.
                </span>
                  </div>
                </Col>
              </Row>
            </Grid>
          );
        }} />,
        <Route key="auth" path="/auth" component={Auth} />,
        <Redirect key="redirect" to="/" />
      ];
    }

    return (
      <div className="container-fluid">
        <Switch>
          {routes}
        </Switch>
      </div>
    );
  }
}

// #region Redux

const mapStateToProps = state => {
  return {
    i18n: state.i18n,
    isLoggedIn: state.isLoggedIn,
    userProfile: state.userProfile,
    // SERVICES
    logger: state.loggerService
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setI18n: (i18n) => dispatch(actions.setI18n(i18n)),
  }
};

// #endregion

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App))
