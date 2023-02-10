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
    id_compra_producto: Number,
    foto_producto: String,
    stock_vendido: {
        type: Number,
        require: true,
    },
    cantidad_comprada: Number,
    medida: String
})

const mySchemeVenta = new Schema({
    cliente: String,
    forma_pago: String,
    identificacion: Number,
    igv: Number,
    productos: [mySchemeProductos],
    numero_venta: {
        unique: true,
        require: true,
        type: String,
    },
    subtotal: Number,
    tipo_documento: String,
    tipo_impresion: String,
    tipo_moneda: String,
    total: Number,
    vuelto: Number,
    estado: Number,
    fecha_registro: String,
    hora_registro: String,
    fecha_actualizacion: String,
    serie: String,
    correlativo: String,
    usuario: String,
    ip_maquina: String,
    fecha_consultas: Date,
});


const Model = mongoose.model('ventas', mySchemeVenta);

module.exports = Model;