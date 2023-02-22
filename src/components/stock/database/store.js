const Model = require('../model/model.js')

async function addStock(stock) {
    const foundLote = await Model.findOne({
        lote: stock.lote,
        id_producto: stock.id_producto
    })

    if (!foundLote) {
        const myStock = new Model(stock);
        myStock.save();
        return;
    }

    updateStock(stock.lote, stock)
    return;

}

async function getStock(filterStock, productosVencidos, stock_bajo) {


    let filter = { estado: 1 }
    if (filterStock !== null) {
        filter = { _id: filterStock }
    }

    if (productosVencidos) {
        let fechasConsulta = JSON.parse(productosVencidos);
        let fechaStart = new Date(fechasConsulta.desde);
        let fechaEnd = new Date(fechasConsulta.hasta);


        const stocks = await Model.aggregate([
            {
                $match: {
                    fecha_vencimiento_consultas: {
                        $gte: fechaStart,
                        $lte: fechaEnd
                    }
                }
            },
            {
                $lookup: {
                    from: 'productos',
                    localField: "id_producto",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                descripcion: 1,
                                id_laboratorio: 1,
                                codigo_barras: 1,
                            }
                        }
                    ],
                    as: 'Producto'
                }
            },
            {
                $project: {
                    fecha_vencimiento: "$fecha_vencimiento",
                    lote: "$lote",
                    stock: "$stock",
                    descripcion: { $arrayElemAt: ["$Producto.descripcion", 0] },
                    laboratorio: { $arrayElemAt: ["$Producto.id_laboratorio", 0] },
                    codigo_barras: { $arrayElemAt: ["$Producto.codigo_barras", 0] }
                }
            }
        ])

        return stocks;

    }

    if (stock_bajo) {
        const stocks = await Model.aggregate([
            {
                $lookup: {
                    from: 'productos',
                    localField: 'id_producto',
                    let: { stock: "$stock" },
                    foreignField: '_id',
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    {
                                        $expr: {
                                            $gte: [
                                                "$stock_minimo", "$$stock"
                                            ]
                                        }
                                    }
                                ],
                            }
                        }
                    ],
                    as: "Producto",
                }
            },
           
            {
                $match: {
                    $and: [
                        {
                            $expr: {
                                $lt: [
                                    "$stock", ["$Producto.stock_minimo"]
                                ]
                            }
                        }
                    ]
                }
            },
            
        ])

        return stocks;
    }

    const stock = await Model.find(filter);
    return stock;

}

async function updateStock(id, body, venta = false, nota_credito = false) {
    const foundStock = await Model.findOne({
        lote: id,
        id_producto: body.id_producto
    })

    if (!venta && !nota_credito) {
        foundStock.stock = Number(foundStock.stock) + Number(body.stock);
        foundStock.fecha_vencimiento = body.fecha_vencimiento || foundStock.fecha_vencimiento;
        foundStock.fecha_vencimiento_consultas = new Date(body.fecha_vencimiento) || foundStock.fecha_vencimiento_consultas;
        foundStock.fecha_actualizacion = `${new Date()}`;
    }

    if (!!venta) {
        foundStock.stock = Number(foundStock.stock) - Number(body.stock);
    }

    if (!!nota_credito) {
        foundStock.stock = Number(foundStock.stock) + Number(body.stock);
    }

    const newStock = await foundStock.save();
    return newStock;

}

async function deletedStock(id) {

    const foundStock = await Model.findOne({
        _id: id,
    })

    foundStock.estado = 0;

    const deletedStock = await foundStock.save();
    return 'Deleted';
}

module.exports = {
    add: addStock,
    list: getStock,
    update: updateStock,
    deleted: deletedStock,
    updateStock
}