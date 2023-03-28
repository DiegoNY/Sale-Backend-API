const express = require('express');
const multer = require('multer');
const controller = require('./controller/controller.js')
const response = require('../../network/response.js')
const router = express.Router();
const upload = multer({
    dest: 'src/public/files/',
})

router.get('/', (req, res) => {
    const filterProducto = req.query.id || null;
    const recientes = req.query.recientes || false;
    const ventas = req.query.ventas || false;
    const stockBajo = req.query.stockBajo || false;
    const stockReporte = req.query.stockReporte || false;
    const kardex = req.query.kardex || false;
    const stock_minimo = req.query.stock_minimo || false;
    const reporteGanancias = req.query.reporte_ganancias || false;
    const compra = req.query.compra || false;

    controller.get(filterProducto, recientes, ventas, stockBajo, stockReporte, kardex, stock_minimo, reporteGanancias, compra)
        .then((productos) => {
            response.successDataApiV1(req, res, productos, 200)
        })
        .catch(e => {
            response.error(req, res, 'Error inesperado', 500, e)
        })

})

router.get('/reporte/stock', async (req, res) => {

    controller.reporteStock()
        .then(rta => {
            res.status(200).send({ error: false, data: rta });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send({ error: true, data: [], message: error })
        })

})
router.get('/reporte/stock_valorizado', async (req, res) => {
    controller.reporteStockValorizado()
        .then(rta => {
            res.status(200).send({ error: false, data: rta });
        })
        .catch(error => {
            console.log(error);
            res.status(500).send({ error: true, data: [], message: error })
        })


})

router.post('/reporte/kardex/:id', async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    controller.ReporteKardex(id, body)
        .then(rta => {
            res.send({ error: false, data: rta })
        })
        .catch(error => res.send({ error: true, message: error, data: [] }))
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