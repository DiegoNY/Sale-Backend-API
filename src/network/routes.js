const express = require('express');
const codigo_barras = require('../components/codigo_barras/network')
const usuarios = require('../components/usuarios/network')
const productos = require('../components/productos/network')
const clientes = require('../components/clientes/network')
const laboratorios = require('../components/laboratorio/network')
const moneda = require('../components/moneda/network')
const proveedor = require('../components/proveedor/network')
const tipoDocumento = require('../components/tipo_documento/network')
const stocks = require('../components/stock/network');
const listacompra = require('../components/compras/network')
const { socket } = require('../socket');
const fecha = new Date()

const routes = function (server) {
    server.use('/api/v2/codigo_barras', codigo_barras);
    server.use('/api/v2/producto', productos);
    server.use('/api/v2/usuario', usuarios);
    server.use('/api/v2/moneda', moneda);
    server.use('/api/v2/proveedor', proveedor);
    server.use('/api/v2/cliente', clientes);
    server.use('/api/v2/laboratorio', laboratorios);
    server.use('/api/v2/tipo_documento', tipoDocumento);
    server.use('/api/v2/stocks', stocks);
    server.use('/api/v2/lista_compra', listacompra);

    socket.io.on('connection', socket => {

        console.log('Socket conectado : ' + socket.id + fecha);



        socket.on('disconnect', () => {
            console.table('El socket : ' + socket.id + ' se desconecto' + fecha)
            console.log('El socket : ' + socket.id + ' se desconecto' + fecha)
        });

    })

    socket.io.on('connection', () => console.log(' Cantidad de Clientes conectados ' + socket.io.engine.clientsCount))

}

module.exports = routes;

