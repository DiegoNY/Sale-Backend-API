const store = require('../database/store.js');

function addUsuario(usuarioData) {

    return new Promise((resolve, reject) => {
        try {
            
            const usuario = {
                cargo: usuarioData.cargo,
                clave: usuarioData.clave,
                dni: usuarioData.dni,
                email: usuarioData.email,
                estado: 1,
                fecha_ingreso: usuarioData.fecha_ingreso,
                nombre: usuarioData.nombre,
                telefono: usuarioData.telefono,
                tipo: usuarioData.tipo,
                tipo_impresion: usuarioData.tipo_impresion,
                usuario: usuarioData.usuario,
            }

            store.add(usuario);
            resolve(usuario);
        } catch (e) {

            reject('[Error al agregar usuario]' + e)

        }


    })

}

function getUsuario(filterUsuario) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterUsuario));
        } catch (e) {
            rejec(`[Error al mostrar usuarios] ${e}`);
        }
    })
}

function updateUsuario(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteUsuario(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }

        const result = store.deleted(id);
        resolve(result);
    });
}

module.exports = {
    add: addUsuario,
    get: getUsuario,
    update: updateUsuario,
    delete: deleteUsuario,
};