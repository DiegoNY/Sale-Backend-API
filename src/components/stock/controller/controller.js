const store = require('../database/store.js');
const hoy = new Date();
let fecha = hoy.toLocaleDateString("es-ES", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})

function addStock(stockData) {

    return new Promise((resolve, reject) => {
        try {

            const proveedor = {
                stock: stockData.stock,
                fecha_registro: fecha,
                estado: 1,
                id_producto: stockData.id_producto,
            }

            store.add(proveedor);
            resolve(proveedor);
        } catch (e) {

            reject('[Error al agregar usuario]' + e)

        }


    })

}

function getStock(filterStock) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterStock));
        } catch (e) {
            rejec(`[Error al mostrar usuarios] ${e}`);
        }
    })
}

function updateStock(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteStock(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }

        const result = store.deleted(id);
        resolve(result);
    });
}

module.exports = {
    add: addStock,
    get: getStock,
    update: updateStock,
    delete: deleteStock,
};