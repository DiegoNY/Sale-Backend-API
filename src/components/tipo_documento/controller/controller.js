const store = require('../database/store.js');
const hoy = new Date();

function addTipoDocumento(tipoDocumentoData) {

    return new Promise((resolve, reject) => {
        try {

            const proveedor = {
                descripcion_caja: tipoDocumentoData.descripcion_caja,
                nombre: tipoDocumentoData.nombre,
                fecha_creacion: hoy,
                direccion: tipoDocumentoData.direccion,
                max_correlativos: tipoDocumentoData.max_correlativos,
                estado: tipoDocumentoData.estado || 1,
                ip_mask: tipoDocumentoData.ip_mask,
                estatus: 1,
                serie: tipoDocumentoData.serie,
                tipo: tipoDocumentoData.tipo,
            }

            store.add(proveedor);
            resolve(proveedor);
        } catch (e) {

            reject('[Error al agregar usuario]' + e)

        }


    })

}

function getTipoDocuemento(filterProveedor) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterProveedor));
        } catch (e) {
            rejec(`[Error al mostrar TP] ${e}`);
        }
    })
}

function updateTipoDocumento(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        try {

            const result = store.update(id, body);
            resolve(result);

        } catch (e) {
            return reject(`[Error al actualizar TP ] ${e}`)
        }
    })
}

function deleteTipoDocumento(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }
        try {

            const result = store.deleted(id);
            resolve(result);
        } catch (e) {
            return reject(`[Error al eliminar un TP] ${e}`)
        }
    });
}

module.exports = {
    add: addTipoDocumento,
    get: getTipoDocuemento,
    update: updateTipoDocumento,
    delete: deleteTipoDocumento,
};