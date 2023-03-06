const express = require('express');

const { Printer } = require('../../../libs/node_thermal_printer.libs.js');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("FUNCIONANDO");
})

router.post('/:impresora', (req, res) => {

    const hoy = new Date();
    let hora = hoy.toLocaleTimeString();

    const EMPRESA = {
        DIRECCION: 'Jr. Monitor Huáscar 290 Urb. San Ignacio - Barranco ',
        TELEFONO: '01692 6092',
        SERIE_NOTA_CREDITO: 'N01',
        AUTORIZACION: '034-005-0006616',
        LOGO_URL: '',
        RUC: '20566487986',
        NOMBRE: 'NOMBRE LARGO DE EMPRESA',
        EMAIL: 'empresa@empresa.com.pe'

    }

    const data = {
        tipo_documento: 'BOLETA ELECTRONICA',
        productos: [
            {
                fecha_registro: '16/01/2023 - 15:27:09',
                stock: 50,
                estado: 1,
                lote: 'PLOP',
                fecha_vencimiento: '2023-05-25',
                codigo_barras: '000002',
                precio_venta: 2.5,
                precio_venta_caja: 35,
                precio_venta_tableta: 6,
                stock_caja: 123,
                stock_tableta: 123,
                stock_minimo: 123,
                tipo: 'Generico',
                venta_sujeta: 'Con receta medica',
                estatus: '1',
                descripcion: 'SAFA',
                id_laboratorio: 'LS-LaboratorioSAC',
                id_lote: '63ffae47a0cd6627c8f0aff0',
                _id: '63c5b346ebaed2d105c63489',
                id_compra: 5,
                precio: 2.5,
                medida: 'U',
                cantidad: 'U-1',
                error: false,
                error_stock: false,
                cantidad_comprada: '1',
                stock_vendido: '1',
                total: 2.5
            },
            {
                fecha_registro: '16/01/2023 - 15:27:09',
                stock: 50,
                estado: 1,
                lote: 'PLOP',
                fecha_vencimiento: '2023-05-25',
                codigo_barras: '000002',
                precio_venta: 2.5,
                precio_venta_caja: 35,
                precio_venta_tableta: 6,
                stock_caja: 123,
                stock_tableta: 123,
                stock_minimo: 123,
                tipo: 'Generico',
                venta_sujeta: 'Con receta medica',
                estatus: '1',
                descripcion: 'SAFA',
                id_laboratorio: 'LS-LaboratorioSAC',
                id_lote: '63ffae47a0cd6627c8f0aff0',
                _id: '63c5b346ebaed2d105c63489',
                id_compra: 6,
                precio: 2.5,
                medida: 'U',
                cantidad: 'U-1',
                error: false,
                error_stock: false,
                cantidad_comprada: '1',
                stock_vendido: '1',
                total: 2.5
            }
        ],
        numero_venta: 'B001-00000708',
        total: 5,
        subtotal: 4.1,
        igv: 0.9,
        identificacion: '00000000',
        cliente: 'CLIENTES VARIOS',
        tipo_impresion: 'TICKET',
        tipo_moneda: 'SOLES',
        forma_pago: 'EFECTIVO',
        cuotas: 0,
        informacion_cuotas: [],
        usuario: '63d9825e070975dfa5b32dbe',
        nombre_usuario: 'Administrador',
        serie: 'B001',
        correlativo: '00000708'
    }

    const { impresora } = req.params;
    const body = req.body;


    const Impresora = new Printer(`${impresora}`);

    Impresora.printer.alignCenter();

    Impresora.printer.println(`${EMPRESA.NOMBRE}`);
    Impresora.printer.println(`${EMPRESA.RUC}`);
    Impresora.printer.println(`${EMPRESA.DIRECCION}`);
    Impresora.printer.println("===============================================");
    Impresora.printer.println(`${data.tipo_documento}`);
    Impresora.printer.println(`${data.numero_venta}`);
    Impresora.printer.println("===============================================");
    Impresora.printer.println(`Fecha:${`${hoy.toISOString()}`.substring(0, 10)} ${hora}`);


    Impresora.printer.printQR("http://192.168.1.11/puntoventa", {
        cellSize: 8,             // 1 - 8
        correction: 'H',         // L(7%), M(15%), Q(25%), H(30%)
        model: 1                 // 1 - Model 1
        // 2 - Model 2 (standard)
        // 3 - Micro QR
    })

    Impresora.printer.cut()

    Impresora.printer.execute((err) => {

        if (err) {
            console.error("Error al imprimir", err)
            return;
        }

        console.log("Todo bien ")
    })

    return res.send({ body });


})


module.exports = router;