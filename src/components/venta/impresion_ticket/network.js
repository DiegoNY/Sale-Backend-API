const express = require('express');
const { Printer } = require('../../../libs/node_thermal_printer.libs.js');
const router = express.Router();

router.post('/:impresora', async (req, res) => {

    const { impresora } = req.params;
    const body = req.body;

    const IMPRESORA = new Printer(`${impresora}`, body);

    if (IMPRESORA?.informacion?.error === true) {
        return res.status(500).send({ error: true, message: IMPRESORA?.informacion?.message });
    }

    return res.status(201).send({ error: false, message: IMPRESORA?.informacion?.message });

})


module.exports = router;