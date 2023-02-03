const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    id_producto: String,
    fecha_registro: String,
    stock: Number,
    estado: Number,
    fecha_actualizacion: String,
    usuario: String,
    ip_maquina: String,
    fecha_consultas: Date,

});

const Model = mongoose.model('stocks', myScheme);

module.exports = Model;