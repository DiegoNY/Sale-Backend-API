const express = require('express');
const multer = require('multer');

const controller = require('./controller/controller.js')
const response = require('../../network/response.js')
const router = express.Router();
const upload = multer({
    dest: 'src/public/files/',
})

router.get('/', (req, res) => {


    const filterGasto = req.query.id || null;

    controller.get(filterGasto)
        .then((data) => {
            response.successDataApiV1(req, res, data, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error inesperado', 500, e)
        })

})

router.post('/', upload.single('imagen'), (req, res) => {

    console.log(req.body);

    controller.add(req.body, req.file)
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