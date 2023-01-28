const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const myScheme = new Schema({
    abreviatura: String,
    fecha_creacion: String,
    fecha_actualizacion: String,
    estado: Number,
    nombre: String,
    simbolo: String,
    usuario: String,
    ip_maquina: String,
});

const Model = mongoose.model('monedas', myScheme);

module.exports = Model;