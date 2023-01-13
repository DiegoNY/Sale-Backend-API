const Model = require('../model/model.js')
const hoy = new Date();


function addStock(stock) {

    const myStock = new Model(stock);
    myStock.save();
}

async function getStock(filterStock) {


    let filter = { estado: 1 }
    if (filterStock !== null) {
        filter = { _id: filterStock }
    }

    const stock = await Model.find(filter);
    return stock;

}

async function updateStock(id, body) {
    const foundStock = await Model.findOne({
        _id: id
    })


    foundStock.stock = body.stock;
    foundStock.fecha_actualizacion = hoy;

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
}