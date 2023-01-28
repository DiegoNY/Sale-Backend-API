const store = require('../database/store.js');
const hoy = new Date();
let fecha = hoy.toLocaleDateString("es-ES", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})

function addApertura(aperturaData) {

    return new Promise((resolve, reject) => {
        try {
            //tipo de identificacion 01 o 06  uno para DNI 06 para RUC 

            const apertura = {
                fecha: fecha,
                dni: aperturaData.dni,
                estado: 1,
                dinero_apertura: aperturaData.dinero_apertura,
                punto_venta: aperturaData.punto_venta,
                usuario: aperturaData.usuario,
            }

            store.add(apertura);
            resolve(apertura);
        } catch (e) {

            reject('[Error al registrar APERTURA]' + e)

        }


    })

}

function getApertura(filterApertura) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterApertura));
        } catch (e) {
            rejec(`[Error al mostrar APERTURA ] ${e}`);
        }
    })
}

function updateApertura(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        try {

            const result = store.update(id, body);
            resolve(result);

        } catch (e) {
            return reject(`[Error al actualizar la APERTURA ] ${e}`)
        }
    })
}

function deleteApertura(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }
        try {

            const result = store.deleted(id);
            resolve(result);
        } catch (e) {
            return reject(`[Error al eliminar una APERTURA ] ${e}`)
        }
    });
}

module.exports = {
    add: addApertura,
    get: getApertura,
    update: updateApertura,
    delete: deleteApertura,
};