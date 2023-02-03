const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const myScheme = new Schema({
    serie: String,
    numero: String,
    fecha_registro: String,
    hora_registro: String,
    usuario: String,
    ip_maquina: String,
    fecha_consultas: Date,

})

const Model = mongoose.model('series', myScheme);


module.exports = Model;