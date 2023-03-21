const store = require('../database/store.js');


function addStock(stockData) {

    return new Promise((resolve, reject) => {
        try {
            const hoy = new Date();

            const lote = {
                stock: stockData.stock,
                stock_inicial: stockData.stock,
                stock_inicial_producto: stockData.stock_inicial,
                fecha_vencimiento: stockData.fecha_vencimiento,
                lote: stockData.lote,
                fecha_registro: `${hoy.toISOString()}`.substring(0, 10),
                estado: 1,
                id_producto: stockData.id_producto,
                fecha_consultas: new Date(),
                fecha_vencimiento_consultas: new Date(stockData.fecha_vencimiento),
                id_medida: stockData.id_medida,
            }

            store.add(lote);
            resolve(lote);
        } catch (e) {

            reject('[Error al agregar stock ]' + e)

        }


    })

}

function getStock(filterStock, productosVencidos, stockbajo) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterStock, productosVencidos, stockbajo));
        } catch (e) {
            rejec(`[Error al mostrar stock] ${e}`);
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
    addStock,
    updateStock,
};