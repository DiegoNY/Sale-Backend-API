const Model = require('../model/model.js')
const hoy = new Date();


function addProductoVendido(producto) {

    const myProducto = new Model(producto);
    myProducto.save();
}

async function getProductosVendidos(filterProductoVendido, mesActual, mesPasado, haceUnAño, haceTresMeses) {


    let filter = { estado: 1 }
    if (filterProductoVendido !== null) {
        filter = { _id: filterProductoVendido }
    }

    console.log(new Date(new Date().getFullYear(), new Date().getMonth(), 1));

    if (!!mesActual) {
        const productos = await Model.aggregate([
            {
                $match: {
                    estado: 1,
                    fecha_consultas: {
                        $gt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                }
            },
            {
                $project: {
                    descripcion: 1,
                    codigo_barras: 1,
                    nombre: 1,
                }
            },
            {
                $group: {
                    _id: "$codigo_barras",
                    cantidad: {
                        $sum: 1
                    },
                    nombre: { $first: "$nombre" }

                }
            },
            { $sort: { cantidad: -1 } },
            { $limit: 5 }
        ]);
        return productos;
    }

    if (!!mesPasado) {

        const inicioMesPasado = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 0);
        const inicioDeEsteMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 0);

        const productos = await Model.aggregate([
            {
                $match: {
                    estado: 1,
                    fecha_consultas: {
                        $gte: inicioMesPasado,
                        $lte: inicioDeEsteMes,
                    }
                }
            },
            {
                $project: {
                    descripcion: 1,
                    codigo_barras: 1,
                    nombre: 1,
                }
            },
            {
                $group: {
                    _id: "$codigo_barras",
                    cantidad: {
                        $sum: 1
                    },
                    nombre: { $first: "$nombre" }
                }
            },
            { $sort: { cantidad: -1 } },
            { $limit: 5 }
        ]);
        return productos;
    }
    if (!!haceUnAño) {

        const productos = await Model.aggregate([
            {
                $match: {
                    estado: 1,
                    fecha_consultas: {
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 12, 0),
                    }
                }
            },
            {
                $project: {
                    descripcion: 1,
                    codigo_barras: 1,
                    nombre: 1,
                }
            },
            {
                $group: {
                    _id: "$codigo_barras",
                    cantidad: {
                        $sum: 1
                    },
                    nombre: { $first: "$nombre" }

                }
            },
            { $sort: { cantidad: -1 } },
        ]);
        return productos;
    }

    if (!!haceTresMeses) {
        const inicioHaceTresMeses = new Date(new Date().getFullYear(), new Date().getMonth() - 2, 0);
        const finDeEsteMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        const productos = await Model.aggregate([
            {
                $match: {
                    estado: 1,
                    fecha_consultas: {
                        $gte: inicioHaceTresMeses,
                        $lte: finDeEsteMes,
                    }
                }
            },
            {
                $project: {
                    descripcion: 1,
                    codigo_barras: 1,
                    nombre: 1,
                }
            },
            {
                $group: {
                    _id: "$codigo_barras",
                    cantidad: {
                        $sum: 1
                    },
                    nombre: { $first: "$nombre" }

                }
            },
            { $sort: { cantidad: -1 } },
            { $limit: 5 }
        ]);
        return productos;
    }

    const productos = await Model.find(filter);
    return productos;

}

async function updateProductoVendido(id, body) {
    const foundProductoVendido = await Model.findOne({
        _id: id
    })

    //codigo para la actualizacion el body igual al modelo 
    
    const newProductoVendido = await foundProductoVendido.save();
    return newProductoVendido;

}

async function deletedProductoVendido(id) {

    const foundProductoVendido = await Model.findOne({
        _id: id,
    })

    foundProductoVendido.estado = 0;

    const deletedProductoVendido = await foundProductoVendido.save();
    return 'Deleted';
}


module.exports = {
    add: addProductoVendido,
    list: getProductosVendidos,
    update: updateProductoVendido,
    deleted: deletedProductoVendido,
}