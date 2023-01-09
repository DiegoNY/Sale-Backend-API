const express = require('express');
const controller = require('./controller/controller.js')
const response = require('../../network/response.js')
const router = express.Router();


router.get('/', (req, res) => {
    const filterProducto = req.query.id || null;

    controller.get(filterProducto)
        .then((productos) => {
            response.successDataApiV1(req, res, productos, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error inesperado', 500, e)
        })

})

router.post('/', (req, res) => {

    controller.add(req.body)
        .then((productos) => {

            response.successDataApiV1(req, res, [{ error: "", body: productos }], 201)

        })
        .catch(e => {
            response.error(req, res, 'Informacion requerida', 400, e)
        });


})

router.put('/', (req, res) => {

    controller.update(req.query.id, req.body)
        .then((data) => {
            response.success(req, res, data, 200);
        })
        .catch(e => {
            response.error(req, res, 'Error interno', 500, e)
        })

})



router.delete('/', (req, res) => {
    controller.delete(req.query.id)
        .then((data) => {
            response.success(req, res, data, 202);
        })
        .catch(e => {
            response.error(req, res, 'Error interno', 500, e);
        })
})

module.exports = router;