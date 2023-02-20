const Model = require('../model/model.js');

function addNotaCredito(notaCredito) {

    const myNotaCredito = new Model(notaCredito);
    myNotaCredito.save();
}

async function getNotaCredito(filterNotaCredito) {

    let filter = {}
    if (filterNotaCredito !== null) {
        filter = { _id: filterNotaCredito }
    }

    const notaCredito = await Model.find(filter);
    return notaCredito;

}

async function updateNotaCredito(id) {
    const foundNotaCredito = await Model.findOne({
        _id: id
    })

    const newNotaCredito = await foundNotaCredito.save();
    return newNotaCredito;

}

module.exports = {
    add: addNotaCredito,
    list: getNotaCredito,
    update: updateNotaCredito
}