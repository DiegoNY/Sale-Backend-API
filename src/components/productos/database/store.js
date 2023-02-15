const Model = require('../model/model.js');
const Lotes = require('../../stock/model/model.js')
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

async function getProducto(filterProducto, recientes, ventas, stockBajo) {


    let filter = { estatus: '1' }
    let productos = [];

    if (filterProducto !== null) {
        filter = { _id: filterProducto }
    }

    if (!recientes && !ventas) {
        productos = await Model.find(filter);
    }

    if (ventas) {
        // productos = await Model.find({ estatus: '1', stock: { $gt: 0 } });

        productos = await Lotes.aggregate(
            [
                {
                    $match: {
                        estado: 1,
                        stock: { $gt: 0 }
                    }
                },
                {
                    $lookup: {
                        from: 'productos',
                        localField: 'id_producto',
                        foreignField: '_id',
                        as: 'informacionProducto'
                    }
                },
                {
                    $addFields: {
                        codigo_barras: { $arrayElemAt: ["$informacionProducto.codigo_barras", 0] },
                        precio_venta: { $arrayElemAt: ["$informacionProducto.precio_venta", 0] },
                        fecha_vencimiento: { $arrayElemAt: ["$informacionProducto.fecha_vencimiento", 0] },
                        precio_venta_caja: { $arrayElemAt: ["$informacionProducto.precio_venta_caja", 0] },
                        precio_venta_tableta: { $arrayElemAt: ["$informacionProducto.precio_venta_tableta", 0] },
                        stock_caja: { $arrayElemAt: ["$informacionProducto.stock_caja", 0] },
                        stock_tableta: { $arrayElemAt: ["$informacionProducto.stock_tableta", 0] },
                        stock_minimo: { $arrayElemAt: ["$informacionProducto.stock_minimo", 0] },
                        tipo: { $arrayElemAt: ["$informacionProducto.tipo", 0] },
                        venta_sujeta: { $arrayElemAt: ["$informacionProducto.venta_sujeta", 0] },
                        fecha_registro: { $arrayElemAt: ["$informacionProducto.fecha_registro", 0] },
                        estatus: { $arrayElemAt: ["$informacionProducto.estatus", 0] },
                        descripcion: { $arrayElemAt: ["$informacionProducto.descripcion", 0] },
                        estado: { $arrayElemAt: ["$informacionProducto.estado", 0] },
                        id_producto: { $arrayElemAt: ["$informacionProducto._id", 0] },
                        id_lote: "$_id"
                    }
                },
                {
                    $project: {
                        id_lote: 1,
                        _id: "$id_producto",
                        stock: 1,
                        lote: 1,
                        fecha_vencimiento: 1,
                        codigo_barras: 1,
                        descripcion: 1,
                        precio_venta: 1,
                        precio_venta_caja: 1,
                        precio_venta_tableta: 1,
                        stock_caja: 1,
                        stock_tableta: 1,
                        stock_minimo: 1,
                        tipo: 1,
                        venta_sujeta: 1,
                        fecha_registro: 1,
                        estatus: 1,
                        estado: 1,
                    }
                }
            ]
        )
    }

    if (recientes) {
        productos = await Model.find(filter).sort({ _id: -1 }).limit(recientes).exec();
    }

    if (stockBajo) {
        console.log(stockBajo);
        productos = await Model.find({ stock: { $gt: 0 } }).sort({ stock: 1 }).limit(stockBajo).exec();
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