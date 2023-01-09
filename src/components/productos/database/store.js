const Model = require('../model/model.js')

function addProducto(producto) {

    const myProducto = new Model(producto);
    myProducto.save();
}

async function getProducto(filterProducto) {


    let filter = { estatus: '1' }
    if (filterProducto !== null) {
        filter = { _id: filterProducto }
    }

    const productos = await Model.find(filter);
    console.log(productos);
    return productos;

}

async function updateProducto(id, body) {
    console.log(body);
    const foundProducto = await Model.findOne({
        _id: id
    })

    foundProducto.descripcion = body.descripcion;
    foundProducto.descuento = body.descuento;
    foundProducto.estado = body.estado;
    foundProducto.foto_producto = body.foto_producto;
    foundProducto.id_laboratorio = body.id_laboratorio;
    foundProducto.precio_compra = body.precio_compra;
    foundProducto.precio_venta = body.precio_venta;
    foundProducto.stock = body.stock;
    foundProducto.stock_minimo = body.stock_minimo;
    foundProducto.tipo = body.tipo;
    foundProducto.fecha_actualizacion = body.fecha_actualizacion;
    foundProducto.venta_sujeta = body.venta_sujeta;

    const newProducto = await foundProducto.save();
    return newProducto;

}

async function deletedProducto(id) {

    const foundProducto = await Model.findOne({
        _id: id,
    })

    foundProducto.estatus = 0;

    const deletedProducto = await foundProducto.save();
    return 'Deleted';
}

module.exports = {
    add: addProducto,
    list: getProducto,
    update: updateProducto,
    deleted: deletedProducto,
}