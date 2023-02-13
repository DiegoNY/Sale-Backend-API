const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const mySchemeProductosVendidos = new Schema({
    id: String,
    codigo_barras: String,
    nombre: String,
    stock_vendido: String,
    medida: String,
    total: Number,
    fecha_vencimiento: String,
    lote: String,
    fecha_registro: String,
    estado: Number,
    fecha_consultas: Date,
})

const Model = mongoose.model('productos_vendidos', mySchemeProductosVendidos);

module.exports = Model;