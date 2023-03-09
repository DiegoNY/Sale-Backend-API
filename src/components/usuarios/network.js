const express = require('express');
const controller = require('./controller/controller.js')
const response = require('../../network/response.js')
const router = express.Router();


router.get('/', (req, res) => {


    const filterUsuario = req.query.id || null;
    console.log(req.query);

    controller.get(filterUsuario)
        .then((usuarios) => {
            response.successDataApiV1(req, res, usuarios, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error inesperado', 500, e)
        })

})

router.post('/', (req, res) => {

    if (req.query.login) {

        controller.validation(req.body)
            .then((login) => {
                response.successDataApiV1(req, res, [{ error: false, body: login }], 202)
            })
            .catch(e => {
                response.error(req, res, 'El usuario no esta registrado', 203, e)
            })
        return;
    }

    controller.add(req.body)
        .then((usuarios) => {

            response.successDataApiV1(req, res, [{ error: "", body: usuarios }], 201)

        })
        .catch(e => {
            response.error(req, res, 'Informacion requerida', 400, e)
        });

})

router.get('/perfil/:id', (req, res) => {

    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ error: true, message: 'El id es requerido' });
    }

    controller.perfil(id)
        .then(data => {
            res.status(200).send({
                error: false,
                message: "ok",
                data: data
            })
        }).catch(error => {
            res.status(400).send({ error: true, message: `${error}`, data: [] })
        })

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