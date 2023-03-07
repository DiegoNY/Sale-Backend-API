const express = require('express');
const controller = require('./controller/controller.js')
const response = require('../../network/response.js')
const router = express.Router();
const historials = require('./historial/controller.js')

router.get('/', (req, res) => {


    const filterCompra = req.query.id || null;
    const skip = req.query.skip || false;
    const limite = req.query.limite || false;
    const ventasRecientes = req.query.recientes || false;
    const diarias = req.query.diarias || false;
    const usuario = req.query.usuario || false;
    const reporteVentas = req.query.reporte || false;
    const reporte = req.query.reporte_busqueda || false;
    const ventasMensuales = req.query.reporte_mensuales || false;
    const historial = req.query.historial || false;
    const reporteCaja = req.query.reporte_caja || false;

    if (historial) {
        const data = historials.getHistorial();
        response.success(req, res, data, 200);
        return;
    }

    controller.get(filterCompra, skip, limite, ventasRecientes, diarias, usuario, reporteVentas, reporte, ventasMensuales, reporteCaja)
        .then((data) => {
            response.successDataApiV1(req, res, data, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error inesperado', 500, e)
        })

})

router.post('/', (req, res) => {

    const historial = req.query.historial || false;

    if (historial) {
        const data = historials.addVenta(req.body);
        response.success(req, res, data, 200);
        return;
    }

    controller.add(req.body)
        .then((data) => {

            response.successDataApiV1(req, res, [{ error: "", body: data }], 201)

        })
        .catch(e => {
            let error = '';

            error = response.MESSAGES_ERROR.INFORMACION_REQUERIDA.message;

            if (e.message.includes('E11000')) {
                error = response.MESSAGES_ERROR.LLAVE_DUPLICADA.message;
            }

            response.error(req, res, error, 400, e)
        });

})

router.put('/:id', (req, res) => {

    controller.update(req.params.id, req.body)
        .then((data) => {
            response.successDataApiV1(req, res, data, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error interno', 500, e)
        })

})



router.delete('/:id', (req, res) => {

    controller.delete(req.params.id)
        .then((data) => {
            response.success(req, res, data, 202);
        })
        .catch(e => {
            response.error(req, res, 'Error interno', 500, e);
        })
})

module.exports = router;