const express = require('express');
const codigo_barras = require('../components/codigo_barras/network');
const usuarios = require('../components/usuarios/network');
const productos = require('../components/productos/network');
const clientes = require('../components/clientes/network');
const laboratorios = require('../components/laboratorio/network');
const moneda = require('../components/moneda/network');
const proveedor = require('../components/proveedor/network');
const tipoDocumento = require('../components/tipo_documento/network');
const stocks = require('../components/stock/network');
const listacompra = require('../components/compras/network');
const apertura = require('../components/caja/network');
const venta = require('../components/venta/network');
const serieVenta = require('../components/series_ventas/network');
const notaSalida = require('../components/nota_salida/network');
const gastos = require('../components/gastos/network');
const productosVendidos = require('../components/productos_vendidos/network');
const notaCredito = require('../components/nota_credito/network');
const sunat = require('../components/sunat/network');
const unidad_medida = require('../components/unidades_medida/network')

/**Impresion 🖨 */
const ticket = require('../components/venta/impresion_ticket/network');
/**End impresion */

const fecha = new Date();
const { socket } = require('../socket');



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
    server.use('/api/v2/caja', apertura);
    server.use('/api/v2/venta', venta);
    server.use('/api/v2/serie_ventas', serieVenta);
    server.use('/api/v2/nota_salida', notaSalida);
    server.use('/api/v2/gastos', gastos);
    server.use('/api/v2/productos_vendidos', productosVendidos);
    server.use('/api/v2/nota_credito', notaCredito);
    server.use('/api/v2/impresion', ticket);
    server.use('/api/v2/procesos', sunat);
    server.use('/ip', (req, res) => {

        var ip = req.ip;
        if (ip.substr(0, 7) == '::ffff:') {
            ip = ip.substr(7);
        }


        res.json({ "ip": ip, "protocol": req.protocol, "headers": req.headers['x-forwarded-for'] });

    })

    server.use('/api/v2/unidad_medida', unidad_medida);

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

