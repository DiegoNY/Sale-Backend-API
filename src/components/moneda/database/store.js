const Model = require('../model/model.js')
const hoy = new Date();

function addMoneda(moneda) {

    const myMoneda = new Model(moneda);
    myMoneda.save();
}

async function getMoneda(filterMoneda) {


    let filter = { estado: 1 }
    if (filterMoneda !== null) {
        filter = { _id: filterMoneda }
    }

    const moneda = await Model.find(filter);
    return moneda;

}

async function updateMoneda(id, body) {
    const foundMoneda = await Model.findOne({
        _id: id
    })


    foundMoneda.abreviatura = body.abreviatura;
    foundMoneda.nombre = body.nombre;
    foundMoneda.simbolo = body.simbolo;
    foundMoneda.fecha_actualizacion = hoy;

    const newMoneda = await foundMoneda.save();
    return newMoneda;

}

async function deletedMoneda(id) {

    const foundMoneda = await Model.findOne({
        _id: id,
    })

    foundMoneda.estado = 0;

    const deletedMoneda = await foundMoneda.save();
    return 'Deleted';
}

module.exports = {
    add: addMoneda,
    list: getMoneda,
    update: updateMoneda,
    deleted: deletedMoneda,
}