const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    id_producto: String,
    fecha_registro: String,
    stock: Number,
    estado: Number,
    fecha_actualizacion: String,
});

const Model = mongoose.model('stocks', myScheme);

module.exports = Model;