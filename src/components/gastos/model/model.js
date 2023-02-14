const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    fecha: String,
    descripcion: String,
    fecha_registro: Date,
    monto: Number,
    usuario: String,
    id_usuario: String,
    estado: Number,
    imagen: String,
});

const Model = mongoose.model('gastos', myScheme);

module.exports = Model;
