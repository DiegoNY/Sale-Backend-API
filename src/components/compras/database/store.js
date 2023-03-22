const Model = require('../model/model.js');
const { update } = require('../../productos/database/store.js');
const { addStock } = require('../../stock/controller/controller.js');
const hoy = new Date();


function sumarStockProductosComprados(productos = []) {
    // console.log(productos);
    const productosSumados = productos.reduce((acumulador, objeto) => {
        if (!acumulador[objeto._id]) {
            acumulador[objeto._id] = {
                _id: objeto._id,
                stock_comprado: Number(objeto.stock_comprado),
                stock_inicial: Number(objeto.stock_inicial),
                fecha_vencimiento: objeto.fecha_vencimiento,
                precio_venta_caja: objeto.precio_venta_caja,
                precio_venta_tableta: objeto.precio_venta_tableta,
                precio_venta: objeto.precio_venta,
                lote: objeto.lote,
                id_medida: objeto.id_medida,
                cantidad_compra: objeto.cantidad_compra
            };
        } else {
            acumulador[objeto._id].stock_comprado += Number(objeto.stock_comprado);
            acumulador[objeto._id].cantidad_compra += Number(objeto.cantidad_compra);
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
                fecha_vencimiento: '',
                lote: '',
                precio_venta_caja: producto[key].precio_venta_caja,
                precio_venta_tableta: producto[key].precio_venta_tableta,
                precio_venta: producto[key].precio_venta,

            }
        )
    }

}
function ingresarStockLotes(productosData = []) {
    const productos = sumarStockProductosComprados(productosData);
    for (let key in productos) {
        addStock(
            {
                stock: productos[key].stock_comprado,
                stock_inicial: productos[key].stock_inicial,
                fecha_vencimiento: productos[key].fecha_vencimiento,
                lote: productos[key].lote,
                id_producto: productos[key]._id,
                id_medida: productos[key].id_medida
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
            ingresarStockLotes(compra.productos);
        })
        .catch(e => console.log('[Error al ingresar lista compra]' + e));

}

async function getListaCompra(filterCompra, recientes, reporte) {


    let filter = { estado: 1 }
    let listacompra;

    if (filterCompra !== null) {
        filter = { _id: filterCompra }
    }

    if (recientes) {
        listacompra = await Model.find().sort({ _id: -1 }).limit(recientes).exec();
    }

    if (!recientes && !reporte) {
        listacompra = await Model.find(filter).sort({ _id: -1 });
    }

    if (!!reporte) {
        let fechasConsulta = JSON.parse(reporte);
        let fechaStart = new Date(fechasConsulta.desde);
        let fechaEnd = new Date(fechasConsulta.hasta);

        listacompra = await Model.find(
            {
                fecha_consultas: {
                    $gte: fechaStart,
                    $lte: fechaEnd,
                },
                estado: 1,
            }
        ).sort({ _id: -1 })

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
            // console.log('Encontrado');
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