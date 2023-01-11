const store = require('../database/store.js');
const hoy = new Date();

function addProveedor(usuarioData) {

    return new Promise((resolve, reject) => {
        try {

            const proveedor = {
                abreviatura: usuarioData.abreviatura,
                correo: usuarioData.correo,
                fecha_creacion: hoy,
                direccion: usuarioData.direccion,
                estado: 1,
                nombre: usuarioData.nombre,
                ruc: usuarioData.ruc,
                telefono: usuarioData.telefono,
            }

            store.add(proveedor);
            resolve(proveedor);
        } catch (e) {

            reject('[Error al agregar usuario]' + e)

        }


    })

}

function getProveedor(filterProveedor) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterProveedor));
        } catch (e) {
            rejec(`[Error al mostrar usuarios] ${e}`);
        }
    })
}

function updateProveedor(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteProveedor(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }

        const result = store.deleted(id);
        resolve(result);
    });
}

module.exports = {
    add: addProveedor,
    get: getProveedor,
    update: updateProveedor,
    delete: deleteProveedor,
};