const express = require('express');
const codigo_barras = require('../components/codigo_barras/network')
const usuarios = require('../components/usuarios/network')
const productos = require('../components/productos/network')
const clientes = require('../components/clientes/network')
const laboratorios = require('../components/laboratorio/network')
const moneda = require('../components/moneda/network')
const proveedor = require('../components/proveedor/network')
const tipoDocumento = require('../components/tipo_documento/network')

const routes = function (server) {
    server.use('/api/v2/codigo_barras', codigo_barras)
    server.use('/api/v2/producto', productos)
    server.use('/api/v2/usuario', usuarios)
    server.use('/api/v2/moneda', moneda)
    server.use('/api/v2/proveedor', proveedor)
    server.use('/api/v2/cliente', clientes)
    server.use('/api/v2/laboratorio', laboratorios)
    server.use('/api/v2/tipo_documento', tipoDocumento)
}

module.exports = routes;

