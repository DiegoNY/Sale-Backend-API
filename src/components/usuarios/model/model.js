const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    cargo: String,
    clave: String,
    dni: Number,
    email: String,
    estado: Number,
    fecha_ingreso: String,
    nombre: String,
    telefono: Number,
    tipo: String,
    tipo_impresion: String,
    usuario: String,
    fecha_actualizacion: String,
    estatus: Number,
});

const Model = mongoose.model('usuarios', myScheme);

module.exports = Model;