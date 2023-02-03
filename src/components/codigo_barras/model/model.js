const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    numero: Number,
    date: Date,
    usuario: String,
    ip_maquina: String,
    fecha_consultas: Date,

});

const Model = mongoose.model('codigos_barra', myScheme);

module.exports = Model;