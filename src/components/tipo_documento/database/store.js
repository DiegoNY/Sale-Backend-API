const Model = require('../model/model.js')
const hoy = new Date();


function addTipoDocumento(tipo_documento) {

    const myTipo_documento = new Model(tipo_documento);
    myTipo_documento.save();
}

async function getTipoDocumento(filterTipoDocumento) {


    let filter = { estatus: 1 }
    if (filterTipoDocumento !== null) {
        filter = { _id: filterTipoDocumento }
    }

    const tipoDocumentos = await Model.find(filter);
    return tipoDocumentos;

}

async function updateTipoDocumentos(id, body) {
    const foundTipoDocumentos = await Model.findOne({
        _id: id
    })


    foundTipoDocumentos.descripcion_caja = body.descripcion_caja;
    foundTipoDocumentos.estado = body.estado;
    foundTipoDocumentos.ip_mask = body.ip_mask;
    foundTipoDocumentos.estado = body.estado;
    foundTipoDocumentos.nombre = body.nombre;
    foundTipoDocumentos.impresora = body.impresora;
    foundTipoDocumentos.serie = body.serie;
    foundTipoDocumentos.tipo = body.tipo;
    foundTipoDocumentos.fecha_actualizacion = hoy;

    const newTipoDocumento = await foundTipoDocumentos.save();
    return newTipoDocumento;

}

async function deletedTipoDocumento(id) {

    const foundTipoDocumento = await Model.findOne({
        _id: id,
    })

    foundTipoDocumento.estatus = 0;

    const deletedTipoDocumento = await foundTipoDocumento.save();
    return 'Deleted';
}

module.exports = {
    add: addTipoDocumento,
    list: getTipoDocumento,
    update: updateTipoDocumentos,
    deleted: deletedTipoDocumento,
}