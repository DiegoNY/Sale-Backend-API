const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const myScheme = new Schema({
    codigo_barras: {
        type: String,
        require: true,
        unique: true,
    },
    descripcion: String,
    fecha_registro: String,
    descuento: Number,
    estado: Number,
    estatus: String,
    foto_producto: String,
    id_laboratorio: String,
    precio_compra: Number,
    precio_venta: Number,
    precio_venta_caja: Number,
    precio_venta_tableta: Number,
    precio_venta_unidad: Number,
    stock: Number,
    stock_minimo: Number,
    tipo: String,
    fecha_actualizacion: String,
    venta_sujeta: String,
    stock_caja: Number,
    stock_tableta: Number,
});

const Model = mongoose.model('productos', myScheme);

module.exports = Model;

