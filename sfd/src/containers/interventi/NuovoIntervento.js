/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React, { Component } from 'react';

import { connect } from 'react-redux';

import { Route, Switch, Redirect, matchPath } from 'react-router-dom';

import SceltaAssistito from './SceltaAssistito';
import AggiungiInterventi from './AggiungiInterventi';

class NuovoIntervento extends Component {
    constructor(props) {
        super(props);

        this.state = {
            assistito: null
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.location !== prevProps.location) {
            this.onRouteChanged();
        }
    }

    onRouteChanged() {
        this.props.logger.info("NuovoIntervento.onRouteChanged", this.props.match, this.props.location);
    }

    onNavLinkClickHandler(e, route) {
        this.props.logger.info('NuovoIntervento.onNavLinkClickHandler =>', e, route);
        if (route.disabled) {
            e.preventDefault();
            return;
        }
        this.props.history.push(route.pathname);
    }

    onAssistitoSelected(assistito) {
        this.props.logger.info('NuovoIntervento.onAssistitoSelected =>', assistito);
        this.setState({
            assistito: assistito
        });
        this.props.history.push(`${this.props.match.url}/step-2`);
    }

    onClearAssisito() {
        this.props.logger.info('NuovoIntervento.onClearAssisito');
        this.setState({
            assistito: null
        });
    }

    onInterventiSavedHandler(interventi) {
        this.props.logger.info('NuovoIntervento.onInviaNuovoIntervento =>', interventi);
        this.props.history.push("/");
    }

    render() {
        const { match, location } = this.props;

        const routes = [{
            title: 'Dati dell\'assistito',
            pathname: `${match.url}/step-1`,
            component: () => (
                <SceltaAssistito values={this.state.assistito} onAssistitoSelected={(e) => this.onAssistitoSelected(e)} />
            )
        }, {
            title: 'Dati dell\'intervento',
            pathname: `${match.url}/step-2`,
            component: () => (
                <AggiungiInterventi assistito={this.state.assistito} onInterventiSaved={(e) => this.onInterventiSavedHandler(e)}
                    onCancel={() => this.onClearAssisito()} />
            ),
            disabled: !this.state.assistito
        }];

        const navLinks = [], switchRoutes = [];
        routes.forEach((route, i) => {
            const step = (i + 1);
            const classes = {
                'active': matchPath(location.pathname, {
                    path: route.pathname,
                    exact: true
                }),
                'disabled': route.disabled
            };
            const className = Object.keys(classes).map((v) => classes[v] ? v : '').join(' ');

            navLinks.push(
                <li role="presentation" className={className} key={'wizard__nav--' + step}>
                    {/* TODO meglio usare una gestione tab di bootstrap per evitare errori di accessibilità */}
                    {/* eslint-disable-next-line */}
                    <a href={null} onClick={(e) => this.onNavLinkClickHandler(e, route)}>{`${step}. ${route.title}`}</a>
                </li>
            );

            switchRoutes.push(
                route.disabled ?
                    <Redirect key={'wizard__step--' + step} exact path={route.pathname} to={`${match.url}/step-${step - 1}`} /> :
                    <Route key={'wizard__step--' + step} exact path={route.pathname} component={route.component} />
            );
        });

        return (
            <div className="intervento--wrapper wizard">
                <h1>Nuovo Intervento</h1>
                <ul className="nav nav-tabs nav-justified">
                    {navLinks}
                </ul>
                <div className="container-fluid">
                    <Switch>
                        <Redirect exact path={match.url} to={routes[0].pathname} />
                        {switchRoutes}
                    </Switch>
                </div>
            </div>
        );
    }
}

// #region Redux

const mapStateToProps = state => {
    return {
        // props
        struttura: state.struttura,
        configurazione: state.configurazione,
        // services
        http: state.httpService,
        logger: state.loggerService
    };
};

// #endregion

export default connect(mapStateToProps)(NuovoIntervento);
