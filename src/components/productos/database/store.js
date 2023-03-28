const Model = require('../model/model.js');
const Lotes = require('../../stock/model/model.js')
const socket = require('../../../socket.js').socket;
const mongoose = require('mongoose');

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

async function getProducto(filterProducto, recientes, ventas, stockBajo, stockReporte, kardex, stock_minimo, reporteGanancias, compra) {


    let filter = { estatus: '1' }
    let productos = [];

    if (filterProducto !== null) {
        filter = { _id: filterProducto }
    }

    if (!recientes && !ventas && !stockReporte && !kardex && !reporteGanancias) {
        productos = await Model.find(filter).sort({ _id: -1 });
    }

    if (ventas) {

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
                    $lookup: {
                        from: 'unidades_medidas',
                        localField: 'id_medida',
                        foreignField: '_id',
                        as: 'medida'
                    }
                },
                {
                    $addFields: {
                        codigo_barras: { $arrayElemAt: ["$informacionProducto.codigo_barras", 0] },
                        precio_venta: { $arrayElemAt: ["$informacionProducto.precio_venta", 0] },
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
                        id_laboratorio: { $arrayElemAt: ["$informacionProducto.id_laboratorio", 0] },
                        id_lote: "$_id",
                        medida: { $arrayElemAt: ["$medida", 0] }
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
                        id_laboratorio: 1,
                        medida: 1
                    }
                },
            ]
        )
    }

    if (recientes) {
        productos = await Model.find(filter).sort({ _id: -1 }).limit(recientes).exec();
    }

    if (stockBajo) {
        productos = await Model.find({ stock: { $gt: 0 } }).sort({ stock: 1 }).limit(stockBajo).exec();
    }

    if (stockReporte) {


        productos = await Model.aggregate(
            [
                {
                    $lookup: {
                        from: 'stocks',
                        localField: '_id',
                        foreignField: 'id_producto',
                        pipeline: [
                            {
                                $project: { stock: 1, id_producto: 1 }
                            },
                            {
                                $group: {
                                    _id: "$id_producto",
                                    cantidad: { $sum: "$stock" },
                                }
                            }
                        ],
                        as: 'Lotes'
                    }
                },
                {
                    $lookup: {
                        from: 'ventas',
                        localField: '_id',
                        let: { id: "$_id" },
                        foreignField: 'productos._id',
                        pipeline: [
                            {
                                $unwind: "$productos"
                            },
                            {
                                $match: {
                                    $and: [
                                        {
                                            $expr: {
                                                $in: [
                                                    "$productos._id", ["$$id"]
                                                ]
                                            }
                                        }
                                    ]
                                }
                            },
                            {
                                $group: {
                                    _id: "$productos._id", // Agrupar por el ID de la venta para volver a construir el arreglo de productos
                                    fecha: { $first: "$fecha_registro" },
                                    cantidad: { $sum: "$productos.stock_vendido" },
                                    // productos: { $push: "$productos" } // Volver a construir el arreglo de productos solo con los productos que tienen el código de barras especificado
                                }
                            },
                        ],
                        as: 'Ventas'
                    }
                },
                {
                    $lookup: {
                        from: 'nota_salidas',
                        localField: 'codigo_barras',
                        let: { codigo: "$codigo_barras" },
                        foreignField: 'productos.codigo_barras',
                        pipeline: [
                            {
                                $unwind: "$productos" //Se destructura el array para poder recorrerlo uno por uno
                            },
                            {
                                $match: {
                                    $and: [
                                        {
                                            $expr: {
                                                $in: [
                                                    "$productos.codigo_barras", ["$$codigo"] //Mostrando solo los productos con el mismo codigo
                                                ]
                                            }
                                        }
                                    ]

                                },

                            },
                            {
                                $group: {
                                    _id: "$productos.codigo_barras", // Agrupar por el ID de la venta para volver a construir el arreglo de productos
                                    fecha: { $first: "$fecha_registro" },
                                    cantidad: { $sum: "$productos.stock_saliente" },
                                    // productos: { $push: "$productos" } // Volver a construir el arreglo de productos solo con los productos que tienen el código de barras especificado
                                }
                            },

                        ],
                        as: 'Salidas',
                    },
                },
                {
                    $project: {
                        Salida: { $first: "$Salidas.cantidad" },
                        Ventas: { $first: "$Ventas.cantidad" },
                        stock: 1,
                        id_laboratorio: 1,
                        descripcion: 1,
                        stock_inicial: 1,
                        codigo_barras: 1,
                        estado: 1,
                        stock_minimo: 1,
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        descripcion: { $first: "$descripcion" },
                        laboratorio: { $first: "$id_laboratorio" },
                        codigo: { $first: "$codigo_barras" },
                        estado: { $first: "$estado" },
                        salidas: { $first: "$stock_inicial" },
                        ventas: { $first: "$Ventas" },
                        stock: { $first: "$stock" },
                        stock_inicial: { $first: { $sum: ["$Salida", "$Ventas", "$stock"] } },
                        stock_minimo: { $first: "$stock_minimo" },

                    }
                },
                {
                    $sort: {
                        _id: -1
                    }
                }
            ]
        )
    }

    if (kardex) {

        let data = JSON.parse(kardex);
        console.log(data);

        productos = await Model.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(data.id_producto),
                    estado: 1,
                }
            },
            {
                $lookup: {
                    from: 'stocks',
                    localField: '_id',
                    let: { id: "$_id" },
                    foreignField: 'id_producto',
                    pipeline: [
                        {
                            $match: {
                                fecha_consultas: {
                                    $gte: new Date(data.desde),
                                    $lte: new Date(data.hasta)
                                }
                            }
                        },
                        {
                            $sort: {
                                id: -1
                            }
                        },
                        {
                            $lookup: {
                                from: 'ventas',
                                localField: 'lote',
                                let: { lote: "$id_producto", stock: { $sum: ["$stock_inicial", "$stock_inicial_producto"] } },
                                foreignField: 'productos.lote',
                                pipeline: [
                                    {
                                        $unwind: "$productos"
                                    },
                                    {
                                        $match: {
                                            $and: [
                                                {
                                                    $expr: {
                                                        $in: [
                                                            "$productos._id", ["$$lote"]
                                                        ]
                                                    },
                                                }
                                            ],
                                            fecha_consultas: {
                                                $gte: new Date(data.desde),
                                                $lte: new Date(data.hasta + 'T23:59:00.000Z')
                                            }
                                        }
                                    },
                                    {
                                        $addFields: {
                                            descripcion: { $concat: ["Salida venta :", "$numero_venta"] },
                                            fecha: { $concat: ["$fecha_registro", " ", "$hora_registro"] },
                                        }
                                    },
                                    {
                                        $group: {
                                            _id: "$_id",
                                            descripcion: { $last: "$descripcion" },
                                            productos: { $last: "$productos" },
                                            fecha: { $last: "$fecha" },
                                            salida: { $sum: "$productos.stock_vendido" },
                                            stock: { $last: "$productos.stock" }

                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            descripcion: 1,
                                            productos: 1,
                                            fecha: 1,
                                            salida: 1,
                                            stock: { $subtract: [{ $toInt: "$stock" }, "$salida"] }
                                        }
                                    },
                                    {
                                        $sort: { _id: 1 }
                                    }

                                ],
                                as: 'ventass'
                            }
                        },
                        {
                            $lookup: {
                                from: 'nota_salidas',
                                localField: 'lote',
                                let: { lote: "$id_producto" },
                                foreignField: 'productos.lote',
                                pipeline: [
                                    {
                                        $unwind: "$productos"
                                    },

                                    {
                                        $match: {
                                            $and: [
                                                {
                                                    $expr: {
                                                        $in: [
                                                            "$productos._id", ["$$lote"]
                                                        ]
                                                    }
                                                }
                                            ],
                                            fecha_consultas: {
                                                $gte: new Date(data.desde),
                                                $lte: new Date(data.hasta)
                                            }
                                        }
                                    },
                                    {
                                        $addFields: {
                                            descripcion: { $concat: ["Salida nota :", "$numeroDocumento"] },
                                            fecha: { $concat: ["$fecha_registro", " ", "$hora_registro"] },

                                        }
                                    },
                                    {
                                        $group: {
                                            _id: "$_id",
                                            fecha: { $first: "$fecha" },
                                            descripcion: { $first: "$descripcion" },
                                            salida: { $sum: "$productos.stock_saliente" },
                                            motivo: { $first: "$motivo" },
                                            stock: { $first: "$productos.stock" }
                                        }
                                    },
                                    {
                                        $sort: {
                                            _id: 1
                                        }
                                    },
                                    {
                                        $project: {
                                            _id: 1,
                                            fecha: 1,
                                            descripcion: 1,
                                            salida: 1,
                                            motivo: 1,
                                            stock: { $subtract: [{ $toInt: "$stock" }, "$salida"] }
                                        }
                                    },
                                ],
                                as: 'salidas'
                            }
                        },
                        {
                            $addFields: {
                                descripcion: { $concat: ["Compra :", "$lote"] },
                            }
                        },
                        {
                            $group: {
                                _id: "$_id",
                                lote: { $first: "$lote" },
                                descripcion: { $first: "$descripcion" },
                                entrada: { $sum: "$stock_inicial" },
                                stock: { $first: { $sum: ["$stock_inicial", "$stock_inicial_producto"] } },
                                fecha: { $first: "$fecha_registro" },
                                ventas: { $first: "$ventass" },
                                salidas: { $first: "$salidas" },
                            }
                        },
                    ],
                    as: 'compras'
                }
            },

        ])
    }

    if (stock_minimo) {

        productos = await Model.aggregate([
            {
                $match: {
                    estado: 1,
                }
            },
            {
                $lookup: {
                    from: 'stocks',
                    localField: '_id',
                    let: { stock_minimo: "$stock_minimo" },
                    foreignField: 'id_producto',
                    pipeline: [
                        {
                            $group: {
                                _id: "$id_producto",
                                stock: { $sum: "$stock" }
                            }
                        },
                        {
                            $match: {
                                $and: [
                                    {
                                        $expr: {
                                            $lte: [
                                                "$stock", "$$stock_minimo"
                                            ]
                                        }
                                    }
                                ],
                            }
                        }
                    ],
                    as: "stock",
                }
            },
            {
                $addFields: {
                    stock_actual: { $arrayElemAt: ["$stock.stock", 0] },
                }
            },
            {
                $group: {
                    _id: "$_id",
                    descripcion: { $first: "$descripcion" },
                    codigo_barras: { $first: "$codigo_barras" },
                    stock_minimo: { $first: "$stock_minimo" },
                    stock_actual: {
                        $first: "$stock_actual"
                    }
                }
            },
            {
                $match: {
                    stock_actual: { $ne: null }
                }
            }

        ]);
    }

    if (reporteGanancias) {
        let data = JSON.parse(reporteGanancias);
        let fechaStart = new Date(data.desde);
        let fechaEnd = new Date(data.hasta);

        const reporte_ganancias = await Model.aggregate([
            {
                $match: {
                    estado: 1,

                }
            },
            {
                $lookup: {
                    from: 'ventas',
                    localField: '_id',
                    let: { id: '$_id' },
                    foreignField: 'productos._id',
                    pipeline: [
                        {
                            $unwind: "$productos"
                        },
                        {
                            $match: {
                                $and: [
                                    {
                                        $expr: {
                                            $in: [
                                                "$productos._id", ["$$id"]
                                            ]
                                        },
                                    }
                                ],
                                fecha_consultas: {
                                    $gte: fechaStart,
                                    $lte: fechaEnd
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$productos._id",
                                cantidad: { $sum: "$productos.stock_vendido" }
                            }
                        }
                    ],
                    as: 'Ventas'
                }
            },
            {
                $project: {
                    _id: 1,
                    descripcion: 1,
                    precio_venta: 1,
                    descripcion: 1,
                    laboratorio: "$id_laboratorio",
                    cantidad_vendida: { $arrayElemAt: ["$Ventas.cantidad", 0] },
                    total: { $multiply: [{ $arrayElemAt: ["$Ventas.cantidad", 0] }, "$precio_venta"] },
                    utilidad: {
                        $subtract: [
                            {
                                $multiply: [{ $arrayElemAt: ["$Ventas.cantidad", 0] }, "$precio_venta"]
                            },
                            {
                                $multiply: [{ $arrayElemAt: ["$Ventas.cantidad", 0] }, "$precio_compra"]
                            }
                        ]
                    }
                }
            }
        ]);

        return reporte_ganancias;
    }

    if (compra) {
        productos = await Model.aggregate([
            {
                $match: {
                    estatus: '1'
                }
            },
            {
                $lookup: {
                    from: 'unidades_medidas',
                    localField: '_id',
                    foreignField: 'id_producto',
                    as: 'medidas'
                }
            }
        ])
    }
    return productos;

}

async function queryStock() {
    const rta = await Model.aggregate([
        {
            $match: {
                estado: 1
            }
        },
        {
            $lookup: {
                localField: "_id",
                from: 'unidades_medidas',
                foreignField: 'id_producto',
                as: 'medidas'
            }
        },
        {
            $unwind: '$medidas'
        },
        {
            $lookup: {
                localField: 'medidas._id',
                from: 'ventas',
                let: { medida: "$medidas._id" },
                foreignField: 'productos.medida',
                pipeline: [
                    {
                        $unwind: '$productos'
                    },
                    {
                        $match: {
                            $and: [
                                {
                                    $expr: {
                                        $in: [
                                            "$productos.medida", ["$$medida"] //Mostrando solo los productos con el mismo codigo
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: "$productos.medida",
                            cantidad: { $sum: "$productos.stock_vendido" },
                            fecha: { $first: "$fecha_registro" }
                        }
                    }
                ],
                as: 'ventas'
            }
        },
        {
            $lookup: {
                localField: 'medidas._id',
                from: 'nota_salidas',
                let: { medida: "$medidas._id" },
                foreignField: 'productos.medida',
                pipeline: [
                    {
                        $unwind: '$productos'
                    },
                    {
                        $match: {
                            $and: [
                                {
                                    $expr: {
                                        $in: [
                                            "$productos.medida", ["$$medida"]
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $group: {
                            _id: "$productos.medida",
                            cantidad: { $sum: "$productos.stock_saliente" },
                            fecha: { $first: "$fecha_registro" }
                        }
                    }
                ],
                as: 'salidas'
            }
        },
        {
            $sort: {
                ventas: -1,
            }
        },
        {
            $project: {
                _id: "$medidas._id",
                descripcion: { $concat: ["$descripcion", " ", "$medidas.nombre"] },
                codigo: "$codigo_barras",
                estado: "$estado",
                laboratorio: "$id_laboratorio",
                salidas: { $ifNull: [{ $arrayElemAt: ["$salidas.cantidad", 0] }, 0] },
                ventas: { $ifNull: [{ $arrayElemAt: ["$ventas.cantidad", 0] }, 0] },
                stock: 1,
                stock_inicial: {
                    $sum: [
                        { $arrayElemAt: ["$ventas.cantidad", 0] },
                        { $arrayElemAt: ["$salidas.cantidad", 0] },
                        "$stock"
                    ]
                },
                stock_minimo: 1
            }
        }


    ])

    return rta;
}
async function queryStockValorizado(_id) {
    const rta = await Model.aggregate([
        {
            $match: {
                estado: 1
            }
        },
        {
            $lookup: {
                localField: "_id",
                from: 'unidades_medidas',
                foreignField: 'id_producto',
                as: 'medidas'
            }
        },
        {
            $unwind: '$medidas'
        },
        {
            $lookup: {
                localField: 'medidas._id',
                from: 'stocks',
                foreignField: 'id_medida',
                as: 'lotes'
            }
        },
        {
            $unwind: "$lotes"
        },
        {
            $project: {
                _id: "$lotes._id",
                descripcion: { $concat: ["$descripcion", " ", "$medidas.nombre"] },
                laboratorio: "$id_laboratorio",
                stock: 1,
                lote: "$lotes.lote",
                fecha_vencimiento: "$lotes.fecha_vencimiento",
                precio_compra: "$medidas.precio_compra",
                valor_total: { $multiply: ["$stock", "$medidas.precio_compra"] }
            }
        }
    ])

    return rta;
}

async function queryKardex(data) {
    const { desde, hasta, id } = data;

    const rta = await Model.aggregate([
        {
            $match: {
                _id: mongoose.Types.ObjectId(id),
                estado: 1,
            }
        },
        {
            $lookup: {
                localField: '_id',
                from: 'stocks',
                foreignField: 'id_producto',
                as: 'lotes'
            }
        }
    ])

    return rta;
}

async function updateProducto(id, body, actualizar_stock_venta = false, actualizarProducto = false) {

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

    if (!actualizar_stock_venta && actualizarProducto === false) foundProducto.stock = body.stock + foundProducto.stock;
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
    queryStock,
    queryStockValorizado,
    queryKardex
}