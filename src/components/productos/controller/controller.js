const store = require('../database/store.js');

function addProducto(productoData) {

    return new Promise((resolve, reject) => {
        if (!productoData.codigo_barras) {
            console.error('[messageController] No contiene codigo barras ')
            return reject('El codigo barras es requerido')
        }

        const producto = {
            codigo_barras: productoData.codigo_barras,
            descripcion: productoData.descripcion,
            fecha_registro: productoData.fecha_registro,
            descuento: productoData.descuento,
            estado: productoData.estado,
            estatus: 1,
            foto_producto: productoData.foto_producto,
            id_laboratorio: productoData.id_laboratorio,
            precio_compra: productoData.precio_compra,
            precio_venta: productoData.precio_venta,
            stock: productoData.stock,
            stock_minimo: productoData.stock_minimo,
            tipo: productoData.tipo,
            fecha_actualizacion: productoData.fecha_actualizacion,
            venta_sujeta: productoData.venta_sujeta,
        }

        store.add(producto);
        resolve(producto);

    })

}

function getProducto(filterCodigoBarra) {

    return new Promise((resolve, rejec) => {
        resolve(store.list(filterCodigoBarra));
    })
}

function updateProducto(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteProducto(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }

        const result = store.deleted(id);
        resolve(result);
    });
}

module.exports = {
    add: addProducto,
    get: getProducto,
    update: updateProducto,
    delete: deleteProducto,
};