/* SPDX-License-Identifier: AGPL-3.0-or-later */
import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import spinner from '../images/spinner.gif';

const Spinner = (props) => { 
  return (<Grid fluid={true}><Row><Col className="text-center" xs={12}><img src={spinner} alt="Caricamento in corso.."></img></Col></Row></Grid>);
}

export default Spinner;
