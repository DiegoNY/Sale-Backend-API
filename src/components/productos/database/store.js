const Model = require('../model/model.js');
const socket = require('../../../socket.js').socket;

let hoy = new Date();

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

async function getProducto(filterProducto, recientes, ventas) {


    let filter = { estatus: '1' }
    let productos = [];

    if (filterProducto !== null) {
        filter = { _id: filterProducto }
    }

    if (!recientes && !ventas) {
        productos = await Model.find(filter);
    }

    if (ventas) {
        productos = await Model.find({ estatus: '1', stock: { $gt: 0 } });
    }

    if (recientes) {
        productos = await Model.find(filter).sort({ _id: -1 }).limit(recientes).exec();
    }

    return productos;

}

async function updateProducto(id, body, actualizar_stock_venta = false) {
    // console.log(body);
    // console.log(id);
    const foundProducto = await Model.findOne({
        _id: id
    })

    foundProducto.descripcion = body.descripcion || foundProducto.descripcion;
    foundProducto.descuento = body.descuento || foundProducto.descuento;
    foundProducto.estado = body.estado || foundProducto.estado;
    foundProducto.foto_producto = body.foto_producto || foundProducto.foto_producto;
    foundProducto.id_laboratorio = body.id_laboratorio || foundProducto.id_laboratorio;
    foundProducto.precio_compra = body.precio_compra || foundProducto.precio_compra;
    foundProducto.precio_compra_caja = body.precio_compra_caja || foundProducto.precio_compra_caja;
    foundProducto.precio_compra_tableta = body.precio_compra_tableta || foundProducto.precio_compra_tableta;

    if (!actualizar_stock_venta) foundProducto.stock = body.stock + foundProducto.stock;
    if (!!actualizar_stock_venta) foundProducto.stock = Number(foundProducto.stock) - Number(body.stock);
    foundProducto.stock_minimo = body.stock_minimo || foundProducto.stock_minimo;
    foundProducto.tipo = body.tipo || foundProducto.tipo;
    foundProducto.fecha_actualizacion = hoy;
    foundProducto.venta_sujeta = body.venta_sujeta || foundProducto.venta_sujeta;
    foundProducto.stock_caja = body.stock_caja || foundProducto.stock_caja;
    foundProducto.stock_tableta = body.stock_tableta || foundProducto.stock_tableta;
    foundProducto.precio_venta = body.precio_venta || foundProducto.precio_venta;
    foundProducto.precio_venta_caja = body.precio_venta_caja || foundProducto.precio_venta_caja;
    foundProducto.precio_venta_tableta = body.precio_venta_tableta || foundProducto.precio_venta_tableta;
    foundProducto.fecha_vencimiento = body.fecha_vencimiento || foundProducto.fecha_vencimiento;
    foundProducto.lote = body.lote || foundProducto.lote;


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