const express = require('express');
const controller = require('./controller/controller.js')
const response = require('../../network/response.js');
const { getUltimaAperturaUsuario } = require('./database/store.js');
const router = express.Router();


router.get('/', (req, res) => {

    const aperturo = req.query.aperturo || false;
    const reporte = req.query.reporte || false;
    const filterApertura = req.query.id || null;
    controller.get(filterApertura, aperturo, reporte)
        .then((data) => {
            response.successDataApiV1(req, res, data, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error inesperado', 500, e)
        })

})

router.post('/', (req, res) => {


    controller.add(req.body)
        .then((data) => {

            response.successDataApiV1(req, res, [{ error: "", body: data }], 201)

        })
        .catch(e => {
            response.error(req, res, 'Informacion requerida', 400, e)
        });

})

router.get('/ultima_apertura/usuario/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const rta = await getUltimaAperturaUsuario(id);
        res.send(rta);
    } catch (error) {
        res.status(400).send({ error: true, message: error });
    }

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