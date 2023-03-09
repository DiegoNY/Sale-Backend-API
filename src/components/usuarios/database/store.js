const Model = require('../model/model.js')
const hoy = new Date();
const VENTAS = require('../../venta/model/model.js');
const mongoose = require('mongoose');

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
        usuario: body.usuario,
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

async function perfil(id) {

    const series = await VENTAS.aggregate([
        {
            $match: {
                usuario: mongoose.Types.ObjectId(id)
            }
        },
        {
            $group: {
                _id: "$serie"
            }
        },

    ])

    const ventas = await VENTAS.aggregate([
        {
            $match: {
                usuario: mongoose.Types.ObjectId(id)
            }
        },
        {
            $project: {
                fecha_registro: 1,
                serie: 1,
                total: 1,
                correlativo: 1,
                numero_venta: 1,
                tipo_documento: 1,
            }
        },
        {
            $sort: {
                _id: 1
            }
        },
        {
            $group: {
                _id: "$serie",
                ventas: { $push: "$$ROOT" },
                primera_venta: { $first: "$correlativo" },
                ultima_venta: { $last: "$correlativo" },
                total: { $sum: "$total" },
                tipo_documento: { $last: "$tipo_documento" },
                fecha: {$first: "$fecha_registro"}
            },
        },


    ])
    return {
        series_utilizadas: series,
        actividad_reciente: ventas
    };
}
module.exports = {
    add: addUsuario,
    list: getUsuario,
    update: updateUsuario,
    deleted: deletedUsuario,
    validation: velidationUsuario,
    perfil,
}