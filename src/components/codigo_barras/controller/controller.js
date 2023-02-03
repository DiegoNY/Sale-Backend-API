const store = require('../database/store.js');

function addCodigoBarras(numero) {
    return new Promise((resolve, reject) => {
        if (!numero) {
            console.error('[messageController] no  hay usuario creado')
            return reject('El nombre es requerido')
        }

        const codigoBarra = {
            numero: numero,
            date: new Date(),
            fecha_consultas: new Date()

        }

        store.add(codigoBarra);
        resolve(codigoBarra);

    })

}

function getCodigosBarras(filterCodigoBarra) {

    return new Promise((resolve, rejec) => {
        resolve(store.list(filterCodigoBarra));
    })
}

function updateCodigoBarras(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

module.exports = {
    addCodigoBarras,
    getCodigosBarras,
    updateCodigoBarras
};