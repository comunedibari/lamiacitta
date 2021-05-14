// SPDX-License-Identifier: AGPL-3.0-or-later
import React from 'react';
import { connect } from 'react-redux';
import { useHistory, withRouter } from 'react-router';

import * as actions from '../../redux/actions';

const AuthUser = ({ ...props }) => {
    let history = useHistory();

    const onClickHandler = () => {
        props.logger.info('AuthUser.onClickHandler =>', props);
        if (props.isLoggedIn) {
            props.effettuaLogout();
        } else {
            history.push('/auth');
        }
    }

    const text = (!props.isLoggedIn ? "Accedi" : `Logout ${props.userProfile.nome} ${props.userProfile.cognome}`);

    return (
        <span style={{ cursor: "pointer" }} title="Accedi" onClick={onClickHandler}>
            <span className="glyphicon glyphicon-user" aria-hidden="true"></span>
            <span className="nome">{text}</span>
        </span>
    );
}

// #region Redux

const mapStateToProps = state => {
    return {
        isLoggedIn: state.isLoggedIn,
        userProfile: state.userProfile,
        // SERVICES
        logger: state.loggerService
    };
};

const mapDispatchToProps = dispatch => {
    return {
        effettuaLogout: () => dispatch(actions.effettuaLogout())
    }
};

// #endregion

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AuthUser));