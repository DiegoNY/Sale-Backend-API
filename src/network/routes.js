const express = require('express');
const codigo_barras = require('../components/codigo_barras/network')
const productos = require('../components/productos/network')

const routes = function (server) {
    server.use('/api/v2/codigo_barras', codigo_barras)
    server.use('/api/v2/producto', productos)
}

module.exports = routes;

