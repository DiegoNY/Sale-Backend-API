const Model = require('../model/model.js')
const hoy = new Date();


function addGasto(gasto) {

    const myGasto = new Model(gasto);
    myGasto.save();
}

async function getGasto(filterGasto) {


    let filter = { estado: 1 }
    if (filterGasto !== null) {
        filter = { _id: filterGasto }
    }

    const gastos = await Model.find(filter).sort({ _id: -1 });
    return gastos;

}

async function updateGasto(id, body) {

    const foundGasto = await Model.findOne({
        _id: id
    })


    foundGasto.cargo = body.cargo;
    foundGasto.clave = body.clave;

    const newGasto = await foundGasto.save();
    return newGasto;

}

async function deletedGasto(id) {

    const foundGasto = await Model.findOne({
        _id: id,
    })

    foundGasto.estado = 0;

    const deletedGasto = await foundGasto.save();
    return 'Deleted';
}



module.exports = {
    add: addGasto,
    list: getGasto,
    update: updateGasto,
    deleted: deletedGasto,
}