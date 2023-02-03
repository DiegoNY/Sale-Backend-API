const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    fecha_creacion: String,
    descripcion_caja: String,
    direccion: String,
    max_correlativos: Number,
    estado: Number,
    estatus: Number,
    ip_mask: String,
    nombre: String,
    tipo: String,
    serie: String,
    fecha_actualizacion: String,
    usuario: String,
    ip_maquina: String,
    fecha_consultas: Date,

});

const Model = mongoose.model('tipo_documentos', myScheme);

module.exports = Model;