const Model = require('../model/model.js')
const hoy = new Date();


function addLaboratorio(laboratorio) {

    const myLaboratorio = new Model(laboratorio);
    myLaboratorio.save();
}

async function getLaboratorio(filterLaboratorio) {


    let filter = { estado: 1 }
    if (filterLaboratorio !== null) {
        filter = { _id: filterLaboratorio }
    }

    const laboratorio = await Model.find(filter);
    return laboratorio;

}

async function updateLaboratorio(id, body) {
    const foundLaboratorio = await Model.findOne({
        _id: id
    })


    foundLaboratorio.abreviatura = body.abreviatura;
    foundLaboratorio.correo = body.correo;
    foundLaboratorio.fecha_creacion = body.fecha_creacion;
    foundLaboratorio.direccion = body.direccion;
    foundLaboratorio.nombre = body.nombre;
    foundLaboratorio.ruc = body.ruc;
    foundLaboratorio.telefono = body.telefono;
    foundLaboratorio.fecha_actualizacion = hoy;

    const newLaboratorio = await foundLaboratorio.save();
    return newLaboratorio;

}

async function deletedLaboratorio(id) {

    const foundLaboratorio = await Model.findOne({
        _id: id,
    })

    foundLaboratorio.estado = 0;

    const deletedLaboratorio = await foundLaboratorio.save();
    return 'Deleted';
}

module.exports = {
    add: addLaboratorio,
    list: getLaboratorio,
    update: updateLaboratorio,
    deleted: deletedLaboratorio,
}