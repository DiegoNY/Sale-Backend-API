const store = require('../database/store.js');


function addInformacionCaja(cajaData) {

    return new Promise((resolve, reject) => {
        try {
            //tipo de identificacion 01 o 06  uno para DNI 06 para RUC 
            const hoy = new Date();

            let fecha = hoy.toLocaleDateString("es-ES", {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })

            const caja = {
                tipo: cajaData.tipo,
                fecha: fecha,
                dni: cajaData.dni,
                estado: 1,
                dinero: cajaData.dinero,
                punto_venta: cajaData.punto_venta,
                usuario: cajaData.usuario,
                fecha_consultas: new Date(),
                id_apertura: cajaData.id_apertura,
            }

            store.add(caja)
                .then(data => resolve(data))
                .catch(Error => reject(`[Error al registrar informacion de caja] ${Error}`))

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
    add: addInformacionCaja,
    get: getApertura,
    update: updateApertura,
    delete: deleteApertura,
};