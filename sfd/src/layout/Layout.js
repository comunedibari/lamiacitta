/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';

import { withRouter, NavLink } from 'react-router-dom';

import { connect } from 'react-redux';

import { scaleDown as Menu } from 'react-burger-menu';

import HeaderPortale from './HeaderPortale';
import FooterPortale from './FooterPortale';

import Spinner from '../components/Spinner';

import './burgermenu.css';

const Layout = ({ ...props }) => {
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
                    <HeaderPortale />
                    <main className="main_container" id="corpo">
                        {props.initialized ? props.children : <Spinner />}
                    </main>
                    <FooterPortale />
                </div>
            </main>
        </div>
    );
}

// #region Redux

const mapStateToProps = state => {
    return {
        initialized: state.initialized,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    }
};

// #endregion


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout));
