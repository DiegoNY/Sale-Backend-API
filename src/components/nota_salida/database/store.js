const Model = require('../model/model.js');
const { update } = require('../../productos/database/store.js');
const { socket } = require('../../../socket.js');
const { add, get } = require('../../series_ventas/controller/controller.js');
const hoy = new Date();


function sumarStockProductosSalientes(productos = []) {
    // console.log(productos);
    const productosSumados = productos.reduce((acumulador, objeto) => {
        if (!acumulador[objeto._id]) {
            acumulador[objeto._id] = {
                _id: objeto._id,
                stock_saliente: Number(objeto.stock_saliente),
                fecha_vencimiento: objeto.fecha_vencimiento,
                lote: objeto.lote,
            };
        } else {
            acumulador[objeto._id].stock_saliente += Number(objeto.stock_vendido);
        }

        return acumulador;
    }, {})

    // console.log(productosSumados);

    return productosSumados;
}

function actualizarStockProductosSalientes(productos = []) {

    const producto = sumarStockProductosSalientes(productos)

    for (let key in producto) {
        update(
            producto[key]._id,
            {
                stock: producto[key].stock_saliente,
            },
            true,
        )
            .then(res => console.log(res))
            .catch(error => console.log(error))
    }

}



function addNotaSalida(nota) {
    return new Promise((resolve, reject) => {

        const myNotaSalida = new Model(nota);

        myNotaSalida.save()
            .then(listaNotaSalida => {
                actualizarStockProductosSalientes(nota.productos);

                add({ serie: listaNotaSalida.serie, numero: listaNotaSalida.numeroDocumento });

                socket.io.emit(
                    'serie_nota_salida',
                    {
                        mensaje: 'Serie en uso',
                        numeroNotaSalida: listaNotaSalida.numeroDocumento,
                        serie: listaNotaSalida.serie,
                        productos: listaNotaSalida.productos
                    }
                )

                resolve(listaNotaSalida);
            })
            .catch(e => {
                console.log('[Error en store nota salida]' + e);
                reject(e);
            });

    })


}

async function getNotasSalida(filterNotaSalida, skip, limite, notasRecientes, series) {

    let filter = { estado: 1 }

    if (filterNotaSalida !== null) {
        filter = { _id: filterNotaSalida }
    }

    if (skip && limite) {
        const listaNotaSalidaPaginadas = await Model.find().skip(skip).limit(limite).exec();
        return listaNotaSalidaPaginadas;
    }

    if (notasRecientes) {

        const notaSalida = await Model.find().sort({ _id: -1 }).limit(notasRecientes).exec();
        return notaSalida;
    }

    if (series) {
        const series_notaSalida = get(false, "N001");
        console.log("Debi ingresar");
        return series_notaSalida;
    }

    const listaVenta = await Model.find(filter).sort({ _id: -1 });
    return listaVenta;

}

async function updateNotaSalida(id, body) {

    const foundNotaSalida = await Model.findOne({
        _id: id,
    })

    //Actualizando productos especificos 
    body.productos.map(async producto => {

        const foundProducto = await foundNotaSalida.productos.id(producto._id);

        if (foundProducto) {
            console.log('Encontrado');
            // console.log(foundProducto._id);
            foundProducto.descripcion = producto.descripcion;
        }
    })

    foundNotaSalida.efectivo = body.efectivo;
    foundNotaSalida.fecha_documento = body.fecha_documento;
    foundNotaSalida.forma_pago = body.forma_pago;
    foundNotaSalida.igv = body.igv;
    foundNotaSalida.productos = body.productos;
    foundNotaSalida.proveedor = body.proveedor;
    foundNotaSalida.subtotal = body.subtotal;
    foundNotaSalida.tipo_documento = body.tipo_documento;
    foundNotaSalida.total = body.total;
    foundNotaSalida.vuelto = body.vuelto;
    foundNotaSalida.fecha_actualizacion = hoy;

    const newNotaSalida = await foundNotaSalida.save();
    return newNotaSalida;

}

async function deletedNotaSalida(id) {

    const foundNotaSalida = await Model.findOne({
        _id: id,
    })

    foundNotaSalida.estado = 0;

    const deletedNotaSalida = await foundNotaSalida.save();
    return 'Deleted';
}



module.exports = {
    add: addNotaSalida,
    list: getNotasSalida,
    update: updateNotaSalida,
    deleted: deletedNotaSalida,
}