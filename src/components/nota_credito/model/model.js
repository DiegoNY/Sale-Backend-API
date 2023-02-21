const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MySchema = new Schema({
    numero: String,
    id_venta: {
        type: Schema.Types.ObjectId,
        ref: 'ventas'
    },
    fecha: String,
    fecha_consultas: Date,
    tipo_documento: String,
    numero_documento: String,
    codigo_anulacion: Number,
    fecha_documento: String,
    motivo: String,
    descripcion: String,
    productos: [],
});

const Model = mongoose.model('nota_credito', MySchema);

module.exports = Model;