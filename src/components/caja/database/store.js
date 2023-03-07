const Model = require('../model/model.js')


function addApertura(apertura) {
    const myApertura = new Model(apertura);
    console.log(apertura);
    return new Promise((resolve, reject) => {
        myApertura.save()
            .then(data => resolve(data))
            .catch(Error => reject(Error));
    })

}

async function getApertura(filterApertura, aperturo, reporte) {


    let filter = { estado: 1 }
    if (filterApertura !== null) {
        filter = { _id: filterApertura }
    }

    if (aperturo) {

        const res = Model.find({ usuario: aperturo }).sort({ _id: -1 }).limit(1);
        return res;
    }

    if (reporte) {
        return Model.aggregate([

            {
                $match: {
                    tipo: "APERTURA"
                }
            },
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'usuario',
                    foreignField: '_id',
                    as: 'usuario'
                }
            },
            {
                $lookup: {
                    from: 'checkoutboxes',
                    localField: '_id',
                    foreignField: 'id_apertura',
                    pipeline: [
                        {
                            $match: {
                                $and: [
                                    {
                                        $expr: {
                                            $in: [
                                                "$tipo", ["CIERRE"]
                                            ]
                                        },
                                    }
                                ],
                            }
                        },

                    ],
                    as: 'cierre'
                }
            },
            {
                $project: {
                    id_usuario: "$_id",
                    usuario: { $arrayElemAt: ["$usuario.nombre", 0] },
                    fecha_registro: "$fecha",
                    hora_registro: "$hora_registro",
                    info_registro: { $concat: ["$fecha", " ", "$hora_registro"] },
                    dinero_registro: "$dinero",
                    fecha_cierre: { $arrayElemAt: ["$cierre.fecha", 0] },
                    hora_cierre: { $arrayElemAt: ["$cierre.hora_registro", 0] },
                    info_cierre: { $concat: [{ $arrayElemAt: ["$cierre.fecha", 0] }, " ", { $arrayElemAt: ["$cierre.hora_registro", 0] }] },
                    dinero_cierre: { $arrayElemAt: ["$cierre.dinero", 0] },
                    total: { $sum: ["dinero", { $arrayElemAt: ["$cierre.dinero", 0] }] },
                    consulta_registro: "$fecha_consultas",
                    consulta_cierre: { $arrayElemAt: ["$cierre.fecha_consultas", 0] }

                }
            }

        ]).sort({ _id: -1 })
    }

    const apertura = await Model.find(filter).sort({ _id: -1 });
    return apertura;

}

async function updateApertura(id, body) {
    const foundApertura = await Model.findOne({
        _id: id
    })

    // foundApertura.descripcion = body.descripcion;
    // foundApertura.direccion = body.direccion;
    // foundApertura.dni = body.dni;
    // foundApertura.telefono = body.telefono;
    // foundApertura.fecha_actualizacion = hoy;

    const newApertura = await foundApertura.save();
    return newApertura;

}

async function deletedApertura(id) {

    const foundApertura = await Model.findOne({
        _id: id,
    })

    foundApertura.estado = 0;

    const deletedApertura = await foundApertura.save();
    return 'Deleted';
}

module.exports = {
    add: addApertura,
    list: getApertura,
    update: updateApertura,
    deleted: deletedApertura,
}