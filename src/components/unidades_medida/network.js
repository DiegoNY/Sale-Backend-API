const express = require('express');
const router = express.Router();

const ServiceUnidad = require('./database/store.js');
const Servicio = new ServiceUnidad();

router.post('/', async (req, res) => {
    const body = req.body;
    const rta = await Servicio.AddMedida(body);
    res.send(rta);

})


router.get('/', async (req, res) => {
    const rta = await Servicio.find();
    res.status(200).send(rta);
})

router.get('/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const unidadMedida = await Servicio.finOne(_id)
        res.status(200).send(unidadMedida);
    } catch (error) {
        res.status(200).send({ error: false, message: "producto inactivo" })
    }
})

router.get('/producto/:_id', async (req, res) => {
    try {
        const { _id } = req.params;
        const rta = await Servicio.GetUnidadesProducto(_id);
        res.status(200).send(rta);
    } catch (error) {
        res.status(200).send({ error: true, message: error })
    }

})

router.delete('/:_id', async (req, res) => {
    const { _id } = req.params;
    const deletes = await Servicio.Delete(_id);
    res.send(deletes)
})

module.exports = router;
