/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';
import { Link } from "react-router-dom";

import { AuthUser } from '../components/auth';

const HeaderPortale = ({ ...props }) => {
    const menuClicked = () => {
        Array.prototype.slice.call(document.getElementsByClassName("bm-burger-button")[0].children)
            .filter((item) => { return item.localName === "button" })[0].click();
    }

    return (
        <header className="header_container">
            <div id="formid_intestazione1" className="header-top clearfix">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-7 col-xs-8 ente-appartenenza">

                        </div>
                        <div className="col-sm-5 col-xs-4 accesso-servizi">
                            <AuthUser />
                        </div>
                    </div>
                </div>
            </div>
            <div id="formid_intestazione2" className="header-middle clearfix">
                <div className="container">
                    <div className="row">
                        <div id="Burger1">
                            <div className="burger-wrapper col-xs-2 col-sm-1">
                                <div id="burger-wrapper" style={{ cursor: "pointer" }}>
                                    <span id="nav-icon" onClick={menuClicked}><span className="fa fa-bars"></span><span className="menu-icon">menu</span></span>
                                    <span style={{ cursor: "pointer", display: "none" }} id="nav-icon"><span className="fa fa-bars"></span><span className="menu-icon">menu</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <nav id="menuEcm" className="navbar navbar-default menu-close">
                            <div className="side-menu-container">
                                <ul id="nav-main" className="nav navbar-nav navmenu">
                                </ul>
                            </div>
                        </nav>

                        <div id="Burger2">
                            <span style={{ cursor: "pointer" }} id="Burger_icon"><span className="menu-icon" style={{ display: 'none' }}>menu</span>
                            </span>
                        </div>

                        <div className="logo-nome-ente col-xs-10">
                            <Link to="/" alt={process.env.PUBLIC_URL + " - Torna alla homepage"}>
                                <span className="logo-wrapper">
                                    <img className="logo" src={process.env.PUBLIC_URL + "/img/logo/logo-ente.png"} alt={process.env.REACT_APP_TITLE} />
                                </span>
                                <span className="nome-wrapper">{process.env.REACT_APP_TITLE}</span>
                            </Link>
                        </div>

                    </div>
                </div>
            </div>

            <div id="formid_intestazione3" className="header-bottom clearfix">
                <div className="container">
                    <div className="row">


                    </div>
                </div>
            </div>

        </header>
    );
}

export default HeaderPortale;