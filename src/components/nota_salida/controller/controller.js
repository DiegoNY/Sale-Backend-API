const store = require('../database/store.js');


function addNotaSalida(notaSalidaData) {

    return new Promise((resolve, reject) => {
        try {
            const hoy = new Date();
            let hora = hoy.toLocaleTimeString();

            const notaSalida = {
                tipo: notaSalidaData.tipo || 'SALIDA',
                solicitante: notaSalidaData.solicitante,
                fecha: notaSalidaData.fecha,
                motivo: notaSalidaData.motivo,
                productos: notaSalidaData.productos,
                numeroDocumento: notaSalidaData.numeroDocumento,
                serie: notaSalidaData.serie,
                correlativo: notaSalidaData.correlativo,
                estado: 1,
                fecha_registro: `${hoy.toISOString()}`.substring(0, 10),
                hora_registro: hora,
                fecha_consultas: new Date()

            }

            store.add(notaSalida)
                .then(res => resolve(res))
                .catch(e => {
                    reject(e);
                });


        } catch (e) {

            reject('[Error al agregar una NOTA SALIDA]' + e)

        }


    })

}

function getNotaSalida(filternota, skip, limit, notasRecientes, serie) {
    console.log(serie);

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filternota, skip, limit, notasRecientes, serie));
        } catch (e) {
            rejec(`[Error al mostrar una NOTA SALIDA ] ${e}`);
        }
    })
}

function updateNotaSalida(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteNotaSalida(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }

        const result = store.deleted(id);
        resolve(result);
    });
}



module.exports = {
    add: addNotaSalida,
    get: getNotaSalida,
    update: updateNotaSalida,
    delete: deleteNotaSalida,
};