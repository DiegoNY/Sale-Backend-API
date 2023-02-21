const store = require('../database/store.js');

function addNotaCredito(body) {
    return new Promise((resolve, reject) => {


        const notaCredito = {
            numero: `NC${body.fecha_registro}${body.hora_registro}`.split('-').join(''),
            id_venta: body._id,
            fecha: body.fecha,
            numero_documento: body.numero_documento,
            fecha_documento: body.fecha_documento,
            motivo: body.motivo,
            descripcion: body.descripcion,
            productos: body.productos,
            fecha_consultas: new Date(),
            codigo_anulacion: body.codigo_anulacion,
        }

        store.add(notaCredito);
        resolve(notaCredito);
    })

}

function getNotaCredito(filterNotaCredito) {

    return new Promise((resolve, reject) => {
        resolve(store.list(filterNotaCredito));
    })
}

function updateNotaCredito(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Datos principales no obtenidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

module.exports = {
    add: addNotaCredito,
    get: getNotaCredito,
    update: updateNotaCredito
};