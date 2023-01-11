const store = require('../database/store.js');
const hoy = new Date();
let fecha = hoy.toLocaleDateString("es-ES", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})

let hora = hoy.toLocaleTimeString("es-ES", {
    hour12: false
})


const dataRegistro = `${fecha} - ${hora}`;

function addMoneda(monedaData) {

    return new Promise((resolve, reject) => {
        try {

            const moneda = {
                abreviatura: monedaData.abreviatura,
                nombre: monedaData.nombre,
                fecha_creacion: dataRegistro,
                estado: 1,
                simbolo: monedaData.simbolo,
            }

            store.add(moneda);
            resolve(moneda);
        } catch (e) {

            reject('[Error al agregar usuario]' + e)

        }


    })

}

function getMoneda(filterMoneda) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterMoneda));
        } catch (e) {
            rejec(`[Error al mostrar MONEDA] ${e}`);
        }
    })
}

function updateMoneda(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        try {

            const result = store.update(id, body);
            resolve(result);

        } catch (e) {
            return reject(`[Error al actualizar MONEDA ] ${e}`)
        }
    })
}

function deleteMoneda(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }
        try {

            const result = store.deleted(id);
            resolve(result);
        } catch (e) {
            return reject(`[Error al eliminar una MONEDA] ${e}`)
        }
    });
}

module.exports = {
    add: addMoneda,
    get: getMoneda,
    update: updateMoneda,
    delete: deleteMoneda,
};