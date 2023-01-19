const store = require('../database/store.js');
const hoy = new Date();


function addListaCompra(listaCompraData) {

    return new Promise((resolve, reject) => {
        try {
            console.log(listaCompraData.productos);

            const listacompra = {
                efectivo: listaCompraData.efectivo,
                fecha_documento: listaCompraData.fecha_documento,
                forma_pago: listaCompraData.forma_pago,
                igv: listaCompraData.igv,
                numero_documento: listaCompraData.numero_documento,
                productos: listaCompraData.productos,
                proveedor: listaCompraData.proveedor,
                subtotal: listaCompraData.subtotal,
                tipo_documento: listaCompraData.tipo_documento,
                total: listaCompraData.total,
                vuelto: listaCompraData.vuelto,
                estado: 1,
                fecha_registro: hoy,
            }

            store.add(listacompra);
            resolve(listacompra);
        } catch (e) {

            reject('[Error al agregar lista compra]' + e)

        }


    })

}

function getListaCompra(filtercompra) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filtercompra));
        } catch (e) {
            rejec(`[Error al mostrar lista compra] ${e}`);
        }
    })
}

function updateListaCompra(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteListaCompra(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }

        const result = store.deleted(id);
        resolve(result);
    });
}

module.exports = {
    add: addListaCompra,
    get: getListaCompra,
    update: updateListaCompra,
    delete: deleteListaCompra,
};