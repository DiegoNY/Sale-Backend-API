const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    fecha: String,
    dni: String,
    tipo: String,
    dinero: Number,
    punto_venta: String,
    dni: Number,
    usuario: String,
    estado: Number,
    fecha_consultas: Date,

});

const Model = mongoose.model('checkoutboxes', myScheme);

module.exports = Model;