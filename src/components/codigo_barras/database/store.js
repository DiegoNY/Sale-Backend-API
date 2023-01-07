const Model = require('../model/model.js')

function addCodigoBarras(codigo_barras) {

    const myCodigoBarras = new Model(codigo_barras);
    myCodigoBarras.save();
}

async function getCodigosBarras(filterCodigoBarras) {
    console.log(filterCodigoBarras)
    let filter = {}
    if (filterCodigoBarras !== null) {
        filter = { _id: filterCodigoBarras }
    }

    const codigos_barras = await Model.find(filter);
    return codigos_barras;

}

async function updateCodigoBarras(id, numero) {
    console.log(body);
    const foundCodigoBarra = await Model.findOne({
        _id: id
    })

    foundCodigoBarra.numero = numero;
    const newCodigoBarras = await foundCodigoBarra.save();
    return newCodigoBarras;

}

module.exports = {
    add: addCodigoBarras,
    list: getCodigosBarras,
    //get
    update: updateCodigoBarras
    //deleted
}