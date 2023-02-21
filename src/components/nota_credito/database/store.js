const Model = require('../model/model.js');
const { update } = require('../../productos/database/store.js');
const { updateStock } = require('../../stock/database/store.js');
const { deletedListaVenta } = require('../../venta/database/store.js');

function sumarStockProductos(productos = []) {
    // console.log(productos);
    const productosSumados = productos.reduce((acumulador, objeto) => {
        if (!acumulador[objeto._id]) {
            acumulador[objeto._id] = {
                _id: objeto._id,
                stock_vendido: Number(objeto.stock_vendido),
                id_lote: objeto.id_lote,
                fecha_vencimiento: objeto.fecha_vencimiento,
                lote: objeto.lote,
            };
        } else {
            acumulador[objeto._id].stock_vendido += Number(objeto.stock_vendido);
        }

        return acumulador;
    }, {})

    // console.log(productosSumados);

    return productosSumados;
}

function actualizarStockProductos(productos = []) {

    const producto = sumarStockProductos(productos)

    for (let key in producto) {
        update(
            producto[key]._id,
            {
                stock: producto[key].stock_vendido,
            },
            true
        )
            .then(producto => console.log(producto))
            .catch(error => console.log(error));
    }

}

function actualizarStockLotes(productos = []) {
    const producto = sumarStockProductos(productos);
    for (let key in producto) {
        updateStock(
            producto[key].lote,
            {
                stock: producto[key].stock_vendido,
                id_producto: producto[key]._id,
            },
            false,
            true,
        )
            .then(stock => console.log(stock))
            .catch(error => console.log(error));
    }
}


function addNotaCredito(notaCredito) {
    const myNotaCredito = new Model(notaCredito);
    return new Promise((resolve, reject) => {
        myNotaCredito.save()
            .then((notaCredito) => {

                try {

                    actualizarStockProductos(notaCredito.productos);
                    actualizarStockLotes(notaCredito.productos);
                    deletedListaVenta(notaCredito.id_venta);

                } catch (Error) {
                    console.log("ERROR EN STORE JUSTO DESPUES DE INGRESAR NOTA DE CREDITO EN BD");
                }

                resolve(notaCredito);
            })
            .catch(Error => {
                console.log("ERROR EN STORE NOTA CREDITO");
                reject(Error)
            });
    })

}

async function getNotaCredito(filterNotaCredito) {

    let filter = {}
    if (filterNotaCredito !== null) {
        filter = { _id: filterNotaCredito }
    }

    const notaCredito = await Model.find(filter);
    return notaCredito;

}

async function updateNotaCredito(id) {
    const foundNotaCredito = await Model.findOne({
        _id: id
    })

    const newNotaCredito = await foundNotaCredito.save();
    return newNotaCredito;

}

module.exports = {
    add: addNotaCredito,
    list: getNotaCredito,
    update: updateNotaCredito
}