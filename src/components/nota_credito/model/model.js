const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MySchema = new Schema({
    numero: String,
    fecha: String,
    fecha_consultas: Date,
    tipo_documento: String,
    numero_documento: String,
    fecha_documento: String,
    motivo: String,
    descripcion: String,
    productos: [],
});

const Model = mongoose.model('nota_credito', MySchema);

module.exports = Model;