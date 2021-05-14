/* SPDX-License-Identifier: AGPL-3.0-or-later */
var Plotly = require('plotly.js/lib/core');

// Load in the trace types for pie, and choropleth
Plotly.register([
    require('plotly.js/lib/bar'),
]);

module.exports = Plotly;
