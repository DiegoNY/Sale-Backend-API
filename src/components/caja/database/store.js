const Model = require('../model/model.js')
const hoy = new Date();


function addApertura(apertura) {

    const myApertura = new Model(apertura);
    myApertura.save();
}

async function getApertura(filterApertura) {


    let filter = { estado: 1 }
    if (filterApertura !== null) {
        filter = { _id: filterApertura }
    }

    const apertura = await Model.find(filter);
    return apertura;

}

async function updateApertura(id, body) {
    const foundApertura = await Model.findOne({
        _id: id
    })

    // foundApertura.descripcion = body.descripcion;
    // foundApertura.direccion = body.direccion;
    // foundApertura.dni = body.dni;
    // foundApertura.telefono = body.telefono;
    // foundApertura.fecha_actualizacion = hoy;

    const newApertura = await foundApertura.save();
    return newApertura;

}

async function deletedApertura(id) {

    const foundApertura = await Model.findOne({
        _id: id,
    })

    foundApertura.estado = 0;

    const deletedApertura = await foundApertura.save();
    return 'Deleted';
}

module.exports = {
    add: addApertura,
    list: getApertura,
    update: updateApertura,
    deleted: deletedApertura,
}