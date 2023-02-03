const express = require('express');
const multer = require('multer');
const controller = require('./controller/controller.js')
const response = require('../../network/response.js')
const router = express.Router();
const upload = multer({
    dest: 'public/files/',
})

router.get('/', (req, res) => {
    const filterProducto = req.query.id || null;
    const recientes = req.query.recientes || false;
    const ventas = req.query.ventas || false;
    const stockBajo = req.query.stockBajo || false;

    controller.get(filterProducto, recientes, ventas, stockBajo)
        .then((productos) => {
            response.successDataApiV1(req, res, productos, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error inesperado', 500, e)
        })

})

router.post('/', upload.single('imagen'), (req, res) => {


    controller.add(req.body, req.file)
        .then((productos) => {

            response.successDataApiV1(req, res, [{ error: "", body: productos }], 201)

        })
        .catch(e => {
            response.error(req, res, 'Informacion requerida', 400, e)
        });


})

router.put('/:id', (req, res) => {

    controller.update(req.params.id, req.body)
        .then((data) => {
            response.success(req, res, data, 200);
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