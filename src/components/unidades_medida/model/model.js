const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UnidadMedidaSchema = new Schema({

    isActive: {
        type: Boolean,
        default: true
    },
    id_producto: {
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        require: true
    },
    nombre: String,
    stock: Number,
    precio_venta: Number,
    precio_compra: Number,
}, { timestamps: true })

const UnidadMedidaModel = mongoose.model('unidades_medida', UnidadMedidaSchema)

module.exports = UnidadMedidaModel;