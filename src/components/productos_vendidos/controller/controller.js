const store = require('../database/store.js');

function addProductosVendidos(productoVendidoData) {

    return new Promise((resolve, reject) => {
        try {
            const hoy = new Date();

            const productoVendido = {
                id: productoVendidoData._id,
                codigo_barras: productoVendidoData.codigo_barras,
                nombre: productoVendidoData.descripcion,
                stock_vendido: productoVendidoData.stock_vendido,
                medida: productoVendidoData.medida,
                total: productoVendidoData.total,
                fecha_vencimiento: productoVendidoData.fecha_vencimiento,
                lote: productoVendidoData.lote,
                fecha_registro: `${hoy.toISOString()}`.substring(0, 10),
                fecha_consultas: new Date('2023-01-15'),
                estado: 1,
            }

            store.add(productoVendido);
            resolve(productoVendido);
        } catch (e) {

            reject('[Error al agregar usuario]' + e)

        }


    })

}

function getProductosVendidos(filterUsuario, mesActual, mesPasado, haceUnAño, haceTresMeses) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterUsuario, mesActual, mesPasado, haceUnAño, haceTresMeses));
        } catch (e) {
            rejec(`[Error al mostrar los productos vendidos] ${e}`);
        }
    })
}

function updateProductosVendidos(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos');
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteProductoVendido(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }

        const result = store.deleted(id);
        resolve(result);
    });
}



module.exports = {
    add: addProductosVendidos,
    get: getProductosVendidos,
    update: updateProductosVendidos,
    delete: deleteProductoVendido,
    addProductosVendidos,
};