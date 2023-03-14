const express = require('express');
const response = require('../../network/response.js')
const router = express.Router();
const axios = require('axios');


router.get('/', (req, res) => {
    const { peticion, descripcion, dni, ruc } = req.query;

    let tipo = 'dni';
    let id = dni;
    const token = 'apis-token-1.aTSI1U7KEuT-6bbbCguH-4Y8TI6KS73N';

    if (descripcion === 'RUC') {
        tipo = 'ruc';
        id = ruc;
    }

    const params = { tipo, id }

    axios.get(`https://api.apis.net.pe/v1/${params.tipo}?numero=${params.id}`, {
        headers: {
            'Referer': 'http://apis.net.pe/api-ruc',
            'Authorization': `Bearer ${token}`
        }
    }).then(rta => {
        console.log(rta.data);
        res.send({ Response: rta.data })

    }).catch(error => {
        console.error(error);
        res.send({ Response:  error.response.data  })
    });


})

module.exports = router;