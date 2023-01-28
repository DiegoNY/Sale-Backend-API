const store = require('../database/store.js');
const hoy = new Date();

let fecha = hoy.toLocaleDateString("es-ES", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})

function addLaboratorio(laboratorioData) {

    return new Promise((resolve, reject) => {
        try {

            const laboratorio = {
                abreviatura: laboratorioData.abreviatura,
                correo: laboratorioData.correo,
                fecha_creacion: fecha,
                direccion: laboratorioData.direccion,
                estado: 1,
                nombre: laboratorioData.nombre,
                ruc: laboratorioData.ruc,
                telefono: laboratorioData.telefono,
            }

            store.add(laboratorio);
            resolve(laboratorio);
        } catch (e) {

            reject('[Error al agregar usuario]' + e)

        }


    })

}

function getLaboratorio(filterLaboratorio) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterLaboratorio));
        } catch (e) {
            rejec(`[Error al mostrar usuarios] ${e}`);
        }
    })
}

function updateLaboratorio(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteLaboratorio(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }
        try {
            const result = store.deleted(id);
            resolve(result);

        } catch (e) {
            return reject('[Error al eliminar un Laboratorio] ' + e)
        }
    });
}

module.exports = {
    add: addLaboratorio,
    get: getLaboratorio,
    update: updateLaboratorio,
    delete: deleteLaboratorio,
};