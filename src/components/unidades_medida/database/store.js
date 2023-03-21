const UnidadMedidaModel = require('../model/model.js');

class UnidadMedida {

    async AddMedida(data) {

        try {
            const UnidadMedida = new UnidadMedidaModel(data);
            const rta = await UnidadMedida.save()
            return rta;
        } catch (error) {
            throw Error("Error al agregar a la base de dataos [STORE UNIDAD MEDIDA]", error);
        }

    }

    async find() {
        try {
            const rta = await UnidadMedidaModel.aggregate([
                {
                    $match: {
                        isActive: true
                    }
                },
                {
                    $lookup: {
                        from: 'productos',
                        localField: 'id_producto',
                        foreignField: '_id',
                        as: 'producto'
                    }
                }
            ])

            return rta;
        } catch (error) {
            throw Error("Error  al buscar unidad de medida", error)
        }
    }

    async finOne(id) {
        const rta = await UnidadMedidaModel.find({ _id: id });

        if (rta.length == 0) {
            throw Error("No se a encontrado el producto");
        }

        if (rta[0].isActive == false) {
            throw Error("Producto no esta activo");
        }

        return rta[0];
    }

    async Update(data) {
        const newUnidadMedida = await UnidadMedidaModel.findOne({ _id: data._id })
        const newUnidad = { ...newUnidadMedida, ...data }
        return newUnidad;
    }

    async Delete(id) {
        const Unidad = await UnidadMedidaModel.findOne({ _id: id })
        Unidad.isActive = false;
        const rta = await Unidad.save();
        return { _id: rta._id }
    }

    async GetUnidadesProducto(id) {
        const unidades = await UnidadMedidaModel.find({ id_producto: id })
        return unidades;
    }

    async GetUnidadesCompra() {
        try {
            const rta = await UnidadMedidaModel.aggregate([
                {
                    $match: {
                        isActive: true
                    }
                },
                {
                    $lookup: {
                        from: 'productos',
                        localField: 'id_producto',
                        foreignField: '_id',
                        as: 'producto'
                    }
                },
                {
                    $addFields: {
                        codigo_barras: { $arrayElemAt: ["$producto.codigo_barras", 0] },
                        tipo: { $arrayElemAt: ["$producto.tipo", 0] },
                        venta_sujeta: { $arrayElemAt: ["$producto.venta_sujeta", 0] },
                        descripcion: { $arrayElemAt: ["$producto.descripcion", 0] },
                        _id: { $arrayElemAt: ["$producto._id", 0] },
                        id_laboratorio: { $arrayElemAt: ["$producto.id_laboratorio", 0] },
                        foto_producto: { $arrayElemAt: ["$producto.foto_producto", 0] },
                        id_medida: "$_id"
                    }
                },
                {   
                    $project:{
                        producto:0
                    }
                }
            ])

            return rta;
        } catch (error) {
            throw Error('Error al mostrar unidades para la compra', error)
        }
    }
}


module.exports = UnidadMedida;