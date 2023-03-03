const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const myScheme = new Schema({
    fecha: String,
    dni: String,
    tipo: String,
    dinero: Number,
    punto_venta: String,
    dni: Number,
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'usuario'
    },
    estado: Number,
    fecha_consultas: Date,
    hora_registro: String,
    id_apertura: {
        type: Schema.Types.ObjectId,
        ref: 'checkoutboxes'
    }

});

const Model = mongoose.model('checkoutboxes', myScheme);

module.exports = Model;