const store = require('../database/store.js');
const hoy = new Date();
let fecha = hoy.toLocaleDateString("es-ES", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})


function addCliente(clienteData) {

    return new Promise((resolve, reject) => {
        try {
            //tipo de identificacion 01 o 06  uno para DNI 06 para RUC 

            const cliente = {
                correo: clienteData.correo,
                fecha_creacion: fecha,
                descripcion: clienteData.descripcion,
                direccion: clienteData.direccion,
                dni: clienteData.dni_ruc,
                estado: 1,
                telefono: clienteData.telefono,
                tipo_identificacion: clienteData.tipo_identificacion,
                fecha_consultas: new Date()

            }

            store.add(cliente);
            resolve(cliente);
        } catch (e) {

            reject('[Error al agregar CLIENTE]' + e)

        }


    })

}

function getCliente(filterCliente, filterClienteDniORuc) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterCliente, filterClienteDniORuc));
        } catch (e) {
            rejec(`[Error al mostrar CLIENTE ] ${e}`);
        }
    })
}

function updateCliente(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        try {

            const result = store.update(id, body);
            resolve(result);

        } catch (e) {
            return reject(`[Error al actualizar CLIENTE ] ${e}`)
        }
    })
}

function deleteCliente(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }
        try {

            const result = store.deleted(id);
            resolve(result);
        } catch (e) {
            return reject(`[Error al eliminar un CLIENTE ] ${e}`)
        }
    });
}

module.exports = {
    add: addCliente,
    get: getCliente,
    update: updateCliente,
    delete: deleteCliente,
};