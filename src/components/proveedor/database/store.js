const Model = require('../model/model.js')
const hoy = new Date();


function addProveedor(proveedor) {

    const myProveedor = new Model(proveedor);
    myProveedor.save();
}

async function getProveedor(filterProveedor) {


    let filter = { estado: 1 }
    if (filterProveedor !== null) {
        filter = { _id: filterProveedor }
    }

    const proveedor = await Model.find(filter);
    return proveedor;

}

async function updateProveedor(id, body) {
    const foundProveedor = await Model.findOne({
        _id: id
    })


    foundProveedor.abreviatura = body.abreviatura;
    foundProveedor.correo = body.correo;
    foundProveedor.fecha_creacion = body.fecha_creacion;
    foundProveedor.direccion = body.direccion;
    foundProveedor.estado = body.estado;
    foundProveedor.nombre = body.nombre;
    foundProveedor.ruc = body.ruc;
    foundProveedor.telefono = body.telefono;
    foundProveedor.fecha_actualizacion = hoy;

    const newProveedor = await foundProveedor.save();
    return newProveedor;

}

async function deletedProveedor(id) {

    const foundProveedor = await Model.findOne({
        _id: id,
    })

    foundProveedor.estado = 0;

    const deletedProveedor = await foundProveedor.save();
    return 'Deleted';
}

module.exports = {
    add: addProveedor,
    list: getProveedor,
    update: updateProveedor,
    deleted: deletedProveedor,
}