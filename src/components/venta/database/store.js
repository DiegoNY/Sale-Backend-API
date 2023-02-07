const Model = require('../model/model.js');
const { update } = require('../../productos/database/store.js');
const { socket } = require('../../../socket.js');
const { add } = require('../../series_ventas/controller/controller.js');
const hoy = new Date();


function sumarStockProductosComprados(productos = []) {
    // console.log(productos);
    const productosSumados = productos.reduce((acumulador, objeto) => {
        if (!acumulador[objeto._id]) {
            acumulador[objeto._id] = {
                _id: objeto._id,
                stock_vendido: Number(objeto.stock_vendido),
                fecha_vencimiento: objeto.fecha_vencimiento,
                lote: objeto.lote,
            };
        } else {
            acumulador[objeto._id].stock_vendido += Number(objeto.stock_vendido);
        }

        return acumulador;
    }, {})

    // console.log(productosSumados);

    return productosSumados;
}

function actualizarStockProductosVendidos(productos = []) {

    const producto = sumarStockProductosComprados(productos)

    for (let key in producto) {
        update(
            producto[key]._id,
            {
                stock: producto[key].stock_vendido,
            },
            true,
        )
    }

}

/**
 * Recibe la lista de compra la guarda en BD 
 * cuando la compra a sido guardada se actualiza el estock de los productos 
 * 
 * @param {*} venta OBJETO CON LA LISTA COMPRA  
 */

function addVenta(venta) {
    return new Promise((resolve, reject) => {

        const myVenta = new Model(venta);

        myVenta.save()
            .then(listaventa => {
                actualizarStockProductosVendidos(venta.productos);

                //se crearan grupos segun la serie que se este usando en estos grupos escucharan los clientes que 
                //se conecten segun la serie para autoincrementar el Numero 


                add({ serie: listaventa.serie, numero: listaventa.numero_venta });

                socket.io.emit(
                    'serie_venta_uso',
                    {
                        mensaje: 'Serie en uso',
                        numero_venta: listaventa.numero_venta,
                        serie: listaventa.serie,
                        productos: listaventa.productos
                    }
                )

                socket.io.emit(
                    'ventas_recientes',
                    {
                        usuario: 'administrador',
                        hora: listaventa.hora_registro,
                        venta: listaventa,
                        _id: listaventa.usuario
                    }
                )
                resolve(listaventa);
            })
            .catch(e => {
                console.log('[Error en store venta]' + e);
                reject(e);
            });

    })


}

async function getVenta(filterVenta, skip, limite, ventasRecientes, diarias, usuario) {

    let filter = { estado: 1 }

    if (filterVenta !== null) {
        filter = { _id: filterVenta }
    }

    if (skip && limite) {
        const listaVentasPaginadas = await Model.find().skip(skip).limit(limite).exec();
        return listaVentasPaginadas;
    }

    if (ventasRecientes) {

        const listaVentas = await Model.find().sort({ _id: -1 }).limit(ventasRecientes).exec();
        return listaVentas;
    }

    if (diarias) {
        let fechasConsulta = JSON.parse(diarias);
        let fechaStart = new Date(fechasConsulta.desde);
        let fechaEnd = new Date(fechasConsulta.hasta);

        const daysOfWeek = ['', 'Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];


        const listaVentasDiarias = await Model.aggregate([
            {
                $match: {
                    fecha_consultas: {
                        $gte: fechaStart,
                        $lte: fechaEnd
                    }
                }
            },
            {
                $project: {
                    fecha_consultas: 1,
                    dayOfWeek: { $dayOfWeek: "$fecha_consultas" },
                    dayName: {
                        $let: {
                            vars: {
                                dayNumber: { $mod: [{ $dayOfWeek: '$fecha_consultas' }, 7] }
                            },
                            in: { $arrayElemAt: [daysOfWeek, "$$dayNumber"] }
                        }
                    }
                    // date: {
                    //     $dateToString: {
                    //         format: "%Y-%m-%d",
                    //         date: "$fecha_consultas"
                    //     }

                    // }
                }
            },
            {
                //Si se quiere acumular por fecha cambiar el nombre del _id por date descomentarlo
                $group: {
                    _id: "$dayName",
                    // dia: { $first: "$date" },
                    totalVentas: { $sum: 1 }
                }
            }
        ]);



        return [{ consultando: fechasConsulta, resultado: listaVentasDiarias }]

    }

    if (usuario) {
        //Se obtiene el dia actual se ingresa el comienzo de dia y el fin del dia 
        //para poder consultar por fecha  
        const hoy = new Date();
        const comienzoDia = new Date(hoy.setHours(0, 0, 0, 0));
        const finDeDia = new Date(hoy.setHours(23, 59, 59, 999));

        const listaVenta = await Model.find({
            usuario: usuario, fecha_consultas: { $gt: comienzoDia, $lt: finDeDia }
        });
        
        return listaVenta
    }

    const listaVenta = await Model.find(filter);
    return listaVenta;

}

async function updateListaVenta(id, body) {

    const foundListaVenta = await Model.findOne({
        _id: id,
    })

    //Actualizando productos especificos 
    body.productos.map(async producto => {

        const foundProducto = await foundListaVenta.productos.id(producto._id);

        if (foundProducto) {
            console.log('Encontrado');
            // console.log(foundProducto._id);
            foundProducto.descripcion = producto.descripcion;
        }
    })

    foundListaVenta.efectivo = body.efectivo;
    foundListaVenta.fecha_documento = body.fecha_documento;
    foundListaVenta.forma_pago = body.forma_pago;
    foundListaVenta.igv = body.igv;
    foundListaVenta.productos = body.productos;
    foundListaVenta.proveedor = body.proveedor;
    foundListaVenta.subtotal = body.subtotal;
    foundListaVenta.tipo_documento = body.tipo_documento;
    foundListaVenta.total = body.total;
    foundListaVenta.vuelto = body.vuelto;
    foundListaVenta.fecha_actualizacion = hoy;

    const newListaVenta = await foundListaVenta.save();
    return newListaVenta;

}

async function deletedListaVenta(id) {

    const foundListaVenta = await Model.findOne({
        _id: id,
    })

    foundListaVenta.estado = 0;

    const deletedListaVenta = await foundListaVenta.save();
    return 'Deleted';
}



module.exports = {
    add: addVenta,
    list: getVenta,
    update: updateListaVenta,
    deleted: deletedListaVenta,
}