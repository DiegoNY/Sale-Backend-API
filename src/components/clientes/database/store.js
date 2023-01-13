const Model = require('../model/model.js')
const hoy = new Date();


function addCliente(cliente) {

    const myCliente = new Model(cliente);
    myCliente.save();
}

async function getCliente(filterCliente) {


    let filter = { estado: 1 }
    if (filterCliente !== null) {
        filter = { _id: filterCliente }
    }

    const cliente = await Model.find(filter);
    return cliente;

}

async function updateCliente(id, body) {
    const foundCliente = await Model.findOne({
        _id: id
    })

    
    foundCliente.correo = body.correo;
    foundCliente.descripcion = body.descripcion;
    foundCliente.direccion = body.direccion;
    foundCliente.dni = body.dni;
    foundCliente.telefono = body.telefono;
    foundCliente.fecha_actualizacion = hoy;

    const newTipoDocumento = await foundCliente.save();
    return newTipoDocumento;

}

async function deletedCliente(id) {

    const foundCliente = await Model.findOne({
        _id: id,
    })

    foundCliente.estado = 0;

    const deletedCliente = await foundCliente.save();
    return 'Deleted';
}

module.exports = {
    add: addCliente,
    list: getCliente,
    update: updateCliente,
    deleted: deletedCliente,
}