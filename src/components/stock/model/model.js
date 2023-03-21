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
    stock_inicial_producto: Number,
    id_medida:{
        type: Schema.Types.ObjectId,
        ref: 'unidades_medidas'
    }

});

const Model = mongoose.model('stocks', myScheme);

module.exports = Model;