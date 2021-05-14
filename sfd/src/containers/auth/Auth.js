/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import * as actions from '../../redux/actions';

import { WS_ENDPOINTS } from '../../shared/constants';

import Spinner from '../../components/Spinner';
import { Login, ModificaPassword, RecuperaPassword, CodiceVerifica } from '../../components/auth';

const Auth = ({ ...props }) => {
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState("login");
    const [message, setMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        setLoading(false);
        setErrorMessage(null);
    }, [view]);

    useEffect(() => {
        props.logger.info('Auth.effect.messaggioErroreLogin => ', props.messaggioErroreLogin);
        if (props.messaggioErroreLogin) {
            setErrorMessage(props.messaggioErroreLogin);
            setLoading(false);
        }
    }, [props.messaggioErroreLogin]);

    useEffect(() => {
        props.logger.info('Auth.effect.codiceErroreLogin => ', props.codiceErroreLogin);
        switch (props.codiceErroreLogin) {
            case 301:
            case 302:
                setView("modifica-password");
                break;
            default:
                break;
        }
    }, [props.codiceErroreLogin]);

    const onLoginHandler = ({ username, password }) => {
        props.logger.info('Auth.onLoginHandler =>', username, password);
        setLoading(true);
        setErrorMessage(null);
        props.effettuaLogin(username, password);
    };

    const onModificaPasswordHandler = ({ username, password, newPassword, newPasswordConfirm }) => {
        props.logger.info('Auth.onModificaPasswordHandler =>', username, password, newPassword, newPasswordConfirm);
        setLoading(true);
        props.http.request("login", {
            username: username,
            password: password,
            nuova_password: newPassword,
        }).then(function (response) {
            setView("login");
            setMessage("Password modificata correttamente!");
        }).catch(({ code, message, data }) => {
            props.logger.error('Auth.onModificaPasswordHandler [ERROR] =>', code, message, data);
            setErrorMessage(message);
        }).finally(() => {
            setLoading(false);
        });
    };

    const onRecuperaPasswordHandler = ({ username, email }) => {
        props.logger.info('Auth.onRecuperaPasswordHandler =>', username, email);
        setLoading(true);
        props.http.request("generaRecuperoPassword", {
            user: username,
            email: email
        }, { url: WS_ENDPOINTS.utenti }).then(() => {
            setView("codice-verifica");
            setMessage("La mail di conferma è stata inviata correttamente!");
        }).catch(({ code, message, data }) => {
            props.logger.error('Auth.onRecuperaPasswordHandler [ERROR] =>', code, message, data);
            setErrorMessage(message);
        }).finally(() => {
            setLoading(false);
        });
    };

    const onCodiceVerificaHandler = ({ code }) => {
        props.logger.info('Auth.onCodiceVerificaHandler =>', code);
        setLoading(true);
        setLoading(true);
        props.http.request("confermaRecuperoPassword", { code: code }, { url: WS_ENDPOINTS.utenti }).then(function (response) {
            setView("login");
            setMessage("La mail con la password temporanea è stata inviata! Dopo il login ti verrà chiesto di modificare la password.");
        }).catch(function ({code, message}) {
            props.logger.error('Auth.onRecuperaPasswordHandler [ERROR] =>', code, message);
            setErrorMessage(message);
        }).finally(() => {
            setLoading(false);
        });
    };

    let viewContent = null;
    if (loading) {
        viewContent = (<Spinner />);
    } else {
        switch (view) {
            case "modifica-password":
                viewContent = (
                    <div className="auth__modifica-password">
                        <h1>Modifica password</h1>
                        <div className="alert alert-warning">
                            <strong>Attenzione!</strong>&nbsp;La password risulta scaduta o si tratta di una password temporanea, per favore inserire una nuova password per accedere.
                    </div>
                        <ModificaPassword onSubmitModificaPassword={onModificaPasswordHandler} />
                        <div className="row mt-2 mb-2">
                            <div className="col-sm-12 text-center">
                                <button type="button" className="btn btn-link" onClick={() => setView("login")}>
                                    Torna indietro
                            </button>
                            </div>
                        </div>
                    </div>
                );
                break;
            case "recupera-password":
                viewContent = (
                    <div className="auth__recupera-password">
                        <h1>Recupera password</h1>
                        <div className="alert alert-info">
                            <strong>Attenzione!</strong>&nbsp;Inserisci il tuo Username o il tuo indirizzo Email per iniziare la procedura.
                    </div>
                        <RecuperaPassword onSubmitRecuperaPassword={onRecuperaPasswordHandler} />
                        <div className="row mt-2 mb-2">
                            <div className="col-sm-12 text-center">
                                <button type="button" className="btn btn-link" onClick={() => setView("login")}>
                                    Torna indietro
                            </button>
                            </div>
                        </div>
                    </div>
                );
                break;
            case "codice-verifica":
                viewContent = (
                    <div className="auth__recupera-password">
                        <h1>Recupera password</h1>
                        <div className="alert alert-warning">
                            <strong>Attenzione!</strong>&nbsp;Verificare la casella di posta e la cartella di <i>SPAM</i>.
                    </div>
                        <CodiceVerifica onSubmitCodiceVerifica={onCodiceVerificaHandler} />
                        <div className="row mt-2 mb-2">
                            <div className="col-sm-12 text-center">
                                <button type="button" className="btn btn-link" onClick={() => setView("recupera-password")}>
                                    Non hai ricevuto il codice? Torna indietro per richiederlo
                            </button>
                            </div>
                        </div>
                    </div>
                );
                break;
            case "login":
            default:
                viewContent = (
                    <div className="auth__login">
                        <h1>Login</h1>
                        <Login onSubmitLogin={onLoginHandler} />
                        <div className="row mt-2 mb-2">
                            <div className="col-sm-12 text-center">
                                <button type="button" className="btn btn-link" onClick={() => setView("recupera-password")}>
                                    Hai dimenticato la password?
                            </button>
                            </div>
                        </div>
                    </div>
                );
        }
    }

    return (
        <div className="auth__wrapper">
            <div className="container">
                {message &&
                    <div className="alert alert-success text-center" style={{ cursor: 'pointer' }} onClick={() => setMessage(null)}>
                        {message}</div>}
                {errorMessage &&
                    <div className="alert alert-danger text-center" style={{ cursor: 'pointer' }} onClick={() => setErrorMessage(null)}>
                        {errorMessage}</div>}
                {viewContent}
            </div>
        </div>
    );
}

// #region Redux

const mapStateToProps = state => {
    return {
        codiceErroreLogin: state.codiceErroreLogin,
        messaggioErroreLogin: state.messaggioErroreLogin,
        // SERVICES
        http: state.httpService,
        logger: state.loggerService
    };
};

const mapDispatchToProps = dispatch => {
    return {
        effettuaLogin: (username, password) => dispatch(actions.effettuaLogin(username, password))
    }
};

// #endregion

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Auth));