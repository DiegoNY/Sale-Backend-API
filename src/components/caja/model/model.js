const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    fecha: String,
    dni: String,
    dinero_apertura: Number,
    punto_venta: String,
    dni: Number,
    usuario: String,
    estado: Number,
});

const Model = mongoose.model('checkoutboxes', myScheme);

module.exports = Model;