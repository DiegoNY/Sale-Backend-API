const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchemeProductos = new Schema({
    id: String,
    codigo_barras: String,
    descripcion: String,
    id_laboratorio: String,
    lote: String,
    fecha_vencimiento: String,
    stock: String,
    precio: Number,
    total: Number,
    id_notasalida: Number,
    foto_producto: String,
    stock_saliente: Number,
    precio_compra: Number,
    precio_compra_caja: Number,
    precio_compra_tableta: Number,
    cantidad: String,
    tipo: String,
    venta_sujeta: String,
})

const mySchemeNotaSalida = new Schema({
    solicitante: String,
    productos: [mySchemeProductos],
    numeroDocumento: {
        unique: true,
        require: true,
        type: String,
    },
    correlativo: String,
    serie: String,
    fecha: String,
    motivo: String,
    usuario: String,
    fecha_registro: String,
    hora_registro: String,
    fecha_actualizacion: String,
    estado: Number,
    fecha_consultas: Date,


});


const Model = mongoose.model('nota_salida', mySchemeNotaSalida);

module.exports = Model;