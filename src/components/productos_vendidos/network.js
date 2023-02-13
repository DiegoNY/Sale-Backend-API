const express = require('express');
const controller = require('./controller/controller.js')
const response = require('../../network/response.js')
const router = express.Router();


router.get('/', (req, res) => {


    const filterProductosVendidos = req.query.id || null;
    const mesActual = req.query.mesActual || false;
    const mesPasado = req.query.mesPasado || false;
    const haceUnAño = req.query.haceUnAño || false;
    const haceTresMeses = req.query.haceTresMeses || false;
    
    controller.get(filterProductosVendidos, mesActual, mesPasado, haceUnAño, haceTresMeses)
        .then((data) => {
            response.successDataApiV1(req, res, data, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error inesperado', 500, e)
        })

})

router.post('/', (req, res) => {


    controller.add(req.body)
        .then((usuarios) => {

            response.successDataApiV1(req, res, [{ error: "", body: usuarios }], 201)

        })
        .catch(e => {
            response.error(req, res, 'Informacion requerida', 400, e)
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