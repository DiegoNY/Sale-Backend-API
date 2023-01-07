const express = require('express');
const controller = require('./controller/controller.js')
const response = require('../../network/response.js')
const router = express.Router();


router.get('/', (req, res) => {

    // controller.getCodigosBarras()
    //     .then((productos) => {
    //         response.successDataApiV1(req, res, productos, 200)
    //     })
    //     .catch(e => {
    //         response.error(req, res, 'Error inesperado', 500, e)
    //     })
    res.send('Funciona get')

})

router.post('/', (req, res) => {

    // controller.addCodigoBarras(req.body)
    //     .then((productos) => {

    //         response.successDataApiV1(req, res, [{ error: "", body: productos }], 201)

    //     })
    //     .catch(e => {
    //         response.error(req, res, 'Informacion requerida', 400, 'Error al registrar codigo de barras')
    //     });

    res.send('funciona post')

})

router.put('/', (req, res) => {
    res.send('Mensaje al actualizar un codigo dee barras')
})



router.delete('/', (req, res) => {
    res.send('Mensaje al eliminar un codigo de barras')
})

module.exports = router;