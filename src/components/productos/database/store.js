const Model = require('../model/model.js');
const socket = require('../../../socket.js').socket;

/**
 * Funcion recibe un objeto y retorna un objeto e
 * ingresa el producto a la base de datos y lo retorna ,
 * el codigo de barras del producto es enviado a todos 
 * los clientes para que sean actualizados 😲
 * 
 * @param {*} producto un objeto con los valores del producto  
 * @returns 
 */
function addProducto(producto) {

    const myProducto = new Model(producto);
    const response = myProducto.save()
        .then(result => {
            console.log('Producto Guardado', result);
            socket.io.on('connection', (socket) => {
                socket.broadcast.emit('codigo_barra_uso', { mensaje: 'Codigo Barras en uso', codigo_barras: result.codigo_barras })
            })
            socket.io.emit('codigo_barra_uso', { mensaje: 'Codigo Barras en uso', codigo_barras: result.codigo_barras });
            return result;
        })
        .catch(error => {
            if (error.code === 11000) {
                console.log('El codigo de barra ya existe');
                return "El codigo de barra ya existe";
            } else {
                console.log('Error al guardar el producto:', error);
            }
        });;

    return response;

}

async function getProducto(filterProducto) {


    let filter = { estatus: '1' }
    if (filterProducto !== null) {
        filter = { _id: filterProducto }
    }

    const productos = await Model.find(filter);
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
    foundProducto.stock_caja = body.stock_caja;
    foundProducto.stock_tableta = body.stock_tableta;
    foundProducto.precio_venta_caja = body.precio_venta_caja;
    foundProducto.precio_venta_tableta = body.precio_venta_tableta;
    foundProducto.precio_venta_unidad = body.precio_venta_unidad;

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