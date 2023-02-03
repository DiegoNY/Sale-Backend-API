const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    abreviatura: String,
    correo: String,
    fecha_creacion: String,
    direccion: String,
    estado: Number,
    nombre: String,
    ruc: Number,
    telefono: Number,
    fecha_actualizacion: String,
    usuario: String,
    ip_maquina: String,
    fecha_consultas: Date,

});

const Model = mongoose.model('proveedors', myScheme);

module.exports = Model;