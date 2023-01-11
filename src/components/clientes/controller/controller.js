const store = require('../database/store.js');
const hoy = new Date();

function addCliente(clienteData) {

    return new Promise((resolve, reject) => {
        try {



            const cliente = {
                correo: clienteData.correo,
                fecha_creacion: hoy,
                descripcion: clienteData.descripcion,
                direccion: clienteData.direccion,
                dni: clienteData.dni,
                estado: 1,
                telefono: clienteData.telefono,
            }

            store.add(cliente);
            resolve(cliente);
        } catch (e) {

            reject('[Error al agregar CLIENTE]' + e)

        }


    })

}

function getCliente(filterCliente) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterCliente));
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