const express = require('express');
const controller = require('./controller/controller.js')
const response = require('../../network/response.js')
const router = express.Router();


router.get('/', (req, res) => {
    const filetrCodigoBarras = req.query.id || null;
    console.log(req.query);

    controller.getCodigosBarras(filetrCodigoBarras)
        .then((codigosBarra) => {
            response.successDataApiV1(req, res, codigosBarra, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error inesperado', 500, e)
        })

})

router.post('/', (req, res) => {

    controller.addCodigoBarras(req.body.numero)
        .then((codigo_barras) => {

            response.successDataApiV1(req, res, [{ error: "", body: codigo_barras }], 201)

        })
        .catch(e => {
            response.error(req, res, 'Informacion requerida', 400, 'Error al registrar codigo de barras')
        });

})

router.put('/:id', (req, res) => {

    console.log(req.params.id);
    controller.updateCodigoBarras(req.params.id, req.body.numero)
        .then((data) => {
            response.success(req, res, data, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error interno', 500, e)
        })

})



router.delete('/:id', (req, res) => {
    controller.updateCodigoBarras()
})

module.exports = router;