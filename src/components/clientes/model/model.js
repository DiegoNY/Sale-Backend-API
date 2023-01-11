const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    correo: String,
    fecha_creacion: String,
    fecha_actualizacion: String,
    descripcion: String,
    direccion: String,
    dni: Number,
    estado: Number,
    telefono: Number,

});

const Model = mongoose.model('clientes', myScheme);

module.exports = Model;