const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    id_producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto'
    },
    fecha_registro: String,
    stock: Number,
    estado: Number,
    fecha_actualizacion: String,
    usuario: String,
    ip_maquina: String,
    fecha_consultas: Date,
    lote: String,
    fecha_vencimiento: String,
    fecha_vencimiento_consultas: Date,
    stock_inicial: Number,

});

const Model = mongoose.model('stocks', myScheme);

module.exports = Model;