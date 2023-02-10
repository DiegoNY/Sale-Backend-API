const store = require('../database/store.js');

function addGasto(gastoData, file) {

    return new Promise((resolve, reject) => {
        try {

            let fileUrl = '';
            if (file) {
                //cambiar url por la carpeta en la que se sirven los estaticos 
                fileUrl = 'http://192.168.1.110:8080/imagen/' + file.filename;
            }

            const gasto = {
                fecha: gastoData.fecha,
                descripcion: gastoData.descripcion,
                fecha_registro: new Date(),
                monto: gastoData.monto,
                usuario: gastoData.usuario,
                id_usuario: gastoData.id_usuario,
                estado: 1,
                imagen: fileUrl

            }

            store.add(gasto);
            resolve(gasto);
        } catch (e) {

            reject('[Error al agregar gasto]' + e)

        }


    })

}

function getGastos(filterGasto) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterGasto));
        } catch (e) {
            rejec(`[Error al mostrar gastos] ${e}`);
        }
    })
}

function updateGasto(id, body) {
    return new Promise(async (resolve, reject) => {
        // console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteGasto(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }

        const result = store.deleted(id);
        resolve(result);
    });
}



module.exports = {
    add: addGasto,
    get: getGastos,
    update: updateGasto,
    delete: deleteGasto,
};