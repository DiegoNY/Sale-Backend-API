const express = require('express');
const controller = require('./controller/controller.js')
const response = require('../../network/response.js')
const router = express.Router();

router.get('/', (req, res) => {
    const filetrSerieVenta = req.query.id || null;

    controller.get(filetrSerieVenta, tipoSerie = false)
        .then((data) => {
            response.successDataApiV1(req, res, data, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error inesperado', 500, e)
        })

})

router.post('/', (req, res) => {

    controller.add(req.body.numero)
        .then((data) => {

            response.successDataApiV1(req, res, [{ error: "", body: data }], 201)

        })
        .catch(e => {
            response.error(req, res, 'Informacion requerida', 400, 'Error al registrar codigo de barras')
        });

})

router.put('/:id', (req, res) => {

    controller.update(req.params.id, req.body)
        .then((data) => {
            response.success(req, res, data, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error interno', 500, e)
        })

})



router.delete('/:id', (req, res) => {
    // controller.updateCodigoBarras()
})

module.exports = router;