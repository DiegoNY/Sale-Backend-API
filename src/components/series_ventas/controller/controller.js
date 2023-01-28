const store = require('../database/store.js');

function addSerieVentas(serie) {
    return new Promise((resolve, reject) => {
        if (!serie) {
            console.error('[messageController] No se encontro la serie')
            return reject('la serie es requerido')
        }

        const serieVenta = {
            serie: serie.serie,
            numero: serie.numero,
            fecha_registro: new Date(),
        }

        store.add(serieVenta);
        resolve(serieVenta);

    })

}

function getSerieVenta(filterSerieVenta) {

    return new Promise((resolve, rejec) => {
        resolve(store.list(filterSerieVenta));
    })
}

function updateSerieVenta(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

module.exports = {
    add: addSerieVentas,
    get: getSerieVenta,
    update: updateSerieVenta
};