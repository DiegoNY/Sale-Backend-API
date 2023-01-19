const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mySchemeProductos = new Schema({
    id: String,
    codigo_barras: String,
    descripcion: String,
    descuento: String,
    descuento_1: String,
    descuento_2: String,
    estatus: String,
    fecha_vencimiento: String,
    fecha_registro: String,
    foto_producto: String,
    id_compra_producto: Number,
    lote: String,
    precio_compra: Number,
    precio_venta: Number,
    stock: String,
    stock_comprado: Number,
    total: Number,
})

const mySchemeListaCompra = new Schema({
    efectivo: Number,
    fecha_documento: String,
    forma_pago: String,
    igv: Number,
    numero_documento: {
        unique: true,
        require: true,
        type: String,
    },
    productos: [mySchemeProductos],
    proveedor: String,
    subtotal: Number,
    tipo_documento: String,
    total: Number,
    vuelto: Number,
    estado: Number,
    fecha_registro: String,
    fecha_actualizacion: String,

});

const Model = mongoose.model('listacompra', mySchemeListaCompra);

module.exports = Model;