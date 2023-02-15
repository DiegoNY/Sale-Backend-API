const Model = require('../model/model.js')
const hoy = new Date();


async function addStock(stock) {
    const foundLote = await Model.findOne({
        lote: stock.lote,
        id_producto: stock.id_producto
    })

    if (!foundLote) {
        const myStock = new Model(stock);
        myStock.save();
        return;
    }

    updateStock(stock.lote, stock)
    return;

}

async function getStock(filterStock) {


    let filter = { estado: 1 }
    if (filterStock !== null) {
        filter = { _id: filterStock }
    }

    const stock = await Model.find(filter);
    return stock;

}

async function updateStock(id, body, venta = false) {
    const foundStock = await Model.findOne({
        lote: id,
        id_producto: body.id_producto
    })
    console.log("desde stocks store")
    console.log(body);
    console.log(foundStock);
    console.log(id);
    if (!venta) {
        foundStock.stock = Number(foundStock.stock) + Number(body.stock);
    }

    if (!!venta) {
        foundStock.stock = Number(foundStock.stock) - Number(body.stock);
    }

    const newStock = await foundStock.save();
    return newStock;

}

async function deletedStock(id) {

    const foundStock = await Model.findOne({
        _id: id,
    })

    foundStock.estado = 0;

    const deletedStock = await foundStock.save();
    return 'Deleted';
}

module.exports = {
    add: addStock,
    list: getStock,
    update: updateStock,
    deleted: deletedStock,
    updateStock
}