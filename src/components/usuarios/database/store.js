const Model = require('../model/model.js')
const hoy = new Date();


function addUsuario(usuario) {

    const myUsuario = new Model(usuario);
    myUsuario.save();
}

async function getUsuario(filterUsuario) {


    let filter = { estado: 1 }
    if (filterUsuario !== null) {
        filter = { _id: filterUsuario }
    }

    const usuarios = await Model.find(filter);
    return usuarios;

}

async function updateUsuario(id, body) {
    console.log(body);
    const foundUsuario = await Model.findOne({
        _id: id
    })


    foundUsuario.cargo = body.cargo;
    foundUsuario.clave = body.clave;
    foundUsuario.dni = body.dni;
    foundUsuario.email = body.email;
    foundUsuario.estatus = body.estatus;
    foundUsuario.fecha_ingreso = body.fecha_ingreso;
    foundUsuario.nombre = body.nombre;
    foundUsuario.telefono = body.telefono;
    foundUsuario.tipo_impresion = body.tipo_impresion;
    foundUsuario.usuario = body.usuario;
    foundUsuario.fecha_actualizacion = hoy;

    const newUsuario = await foundUsuario.save();
    return newUsuario;

}

async function deletedUsuario(id) {

    const foundUsuario = await Model.findOne({
        _id: id,
    })

    foundUsuario.estado = 0;

    const deletedUsuario = await foundUsuario.save();
    return 'Deleted';
}

async function velidationUsuario(body) {

    const foundUsuario = await Model.findOne({
        email: body.usuario,
        clave: body.contraseña
    })

    console.log(foundUsuario);
    if (foundUsuario) {
        return foundUsuario;
    }

    if (!foundUsuario) {
        throw new Error('Usuario no encontrado');
    }

}
module.exports = {
    add: addUsuario,
    list: getUsuario,
    update: updateUsuario,
    deleted: deletedUsuario,
    validation: velidationUsuario,
}