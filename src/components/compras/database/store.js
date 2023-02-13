const Model = require('../model/model.js');
const { update } = require('../../productos/database/store.js')
const hoy = new Date();


function sumarStockProductosComprados(productos = []) {
    // console.log(productos);
    const productosSumados = productos.reduce((acumulador, objeto) => {
        if (!acumulador[objeto._id]) {
            acumulador[objeto._id] = {
                _id: objeto._id,
                stock_comprado: Number(objeto.stock_comprado),
                fecha_vencimiento: objeto.fecha_vencimiento,
                precio_venta_caja: objeto.precio_venta_caja,
                precio_venta_tableta: objeto.precio_venta_tableta,
                precio_venta: objeto.precio_venta,
                lote: objeto.lote,
            };
        } else {
            acumulador[objeto._id].stock_comprado += Number(objeto.stock_comprado);
        }

        return acumulador;
    }, {})

    // console.log(productosSumados);

    return productosSumados;
}

function actualizarStockProductosComprados(productos = []) {
    const producto = sumarStockProductosComprados(productos)

    for (let key in producto) {
        update(
            producto[key]._id,
            {
                stock: producto[key].stock_comprado,
                fecha_vencimiento: producto[key].fecha_vencimiento,
                lote: producto[key].lote,
                precio_venta_caja: producto[key].precio_venta_caja,
                precio_venta_tableta: producto[key].precio_venta_tableta,
                precio_venta: producto[key].precio_venta,

            }
        )
    }

}

/**
 * Recibe la lista de compra la guarda en BD 
 * cuando la compra a sido guardada se actualiza el estock de los productos 
 * 
 * @param {*} compra OBJETO CON LA LISTA COMPRA  
 */

function addListaCompra(compra) {
    const myCompra = new Model(compra);
    myCompra.save()
        .then(listacompra => {
            // console.log(compra.productos);
            actualizarStockProductosComprados(compra.productos);
        })
        .catch(e => console.log('[Error al ingresar lista compra]' + e));

}

async function getListaCompra(filterCompra, recientes) {


    let filter = { estado: 1 }
    let listacompra;

    if (filterCompra !== null) {
        filter = { _id: filterCompra }
    }

    if (recientes) {
        listacompra = await Model.find().sort({ _id: -1 }).limit(recientes).exec();
    }

    if (!recientes) {
        listacompra = await Model.find(filter).sort({ _id: -1 });
    }

    return listacompra;

}

async function updateListaCompra(id, body) {

    const foundListaCompra = await Model.findOne({
        _id: id,
    })

    //Actualizando productos especificos 
    body.productos.map(async producto => {

        const foundProducto = await foundListaCompra.productos.id(producto._id);

        if (foundProducto) {
            console.log('Encontrado');
            // console.log(foundProducto._id);
            foundProducto.descripcion = producto.descripcion;
        }
    })

    foundListaCompra.efectivo = body.efectivo;
    foundListaCompra.fecha_documento = body.fecha_documento;
    foundListaCompra.forma_pago = body.forma_pago;
    foundListaCompra.igv = body.igv;
    foundListaCompra.productos = body.productos;
    foundListaCompra.proveedor = body.proveedor;
    foundListaCompra.subtotal = body.subtotal;
    foundListaCompra.tipo_documento = body.tipo_documento;
    foundListaCompra.total = body.total;
    foundListaCompra.vuelto = body.vuelto;
    foundListaCompra.fecha_actualizacion = hoy;

    const newListaCompra = await foundListaCompra.save();
    return newListaCompra;

}

async function deletedListaCompra(id) {

    const foundListaCompra = await Model.findOne({
        _id: id,
    })

    foundListaCompra.estado = 0;

    const deletedListaCompra = await foundListaCompra.save();
    return 'Deleted';
}



module.exports = {
    add: addListaCompra,
    list: getListaCompra,
    update: updateListaCompra,
    deleted: deletedListaCompra,
}