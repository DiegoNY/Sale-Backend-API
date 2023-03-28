const { queryGanancias } = require('../database/store.js');
const store = require('../database/store.js');


function addListaVenta(listaVentaData) {

    return new Promise((resolve, reject) => {
        try {
            const hoy = new Date();

            let hora = hoy.toLocaleTimeString();

            const listaventa = {
                cliente: listaVentaData.cliente,
                forma_pago: listaVentaData.forma_pago,
                identificacion: listaVentaData.identificacion,
                igv: listaVentaData.igv,
                productos: listaVentaData.productos,
                numero_venta: listaVentaData.numero_venta,
                serie: listaVentaData.serie,
                correlativo: listaVentaData.correlativo,
                subtotal: listaVentaData.subtotal,
                tipo_documento: listaVentaData.tipo_documento,
                tipo_impresion: listaVentaData.tipo_impresion,
                tipo_moneda: listaVentaData.tipo_moneda,
                total: listaVentaData.total,
                vuelto: listaVentaData.vuelto,
                estado: 1,
                fecha_registro: `${hoy.toISOString()}`.substring(0, 10),
                hora_registro: hora,
                fecha_consultas: new Date(),
                usuario: listaVentaData.usuario,
                cuotas: listaVentaData.cuotas,
                informacion_cuotas: listaVentaData.informacion_cuotas,
                nombre_usuario: listaVentaData.nombre_usuario,
                impresora: listaVentaData.impresora,
            }

            store.add(listaventa)
                .then(res => resolve(res))
                .catch(e => {
                    reject(e);
                });


        } catch (e) {

            reject('[Error al agregar una VENTA]' + e)

        }


    })

}

function getListaVenta(filterventa, skip, limit, ventasRecientes, diarias, usuario, reporteVentas, reporte, ventasMensuales, reporteCaja) {

    return new Promise((resolve, rejec) => {
        try {

            resolve(store.list(filterventa, skip, limit, ventasRecientes, diarias, usuario, reporteVentas, reporte, ventasMensuales, reporteCaja));
        } catch (e) {
            rejec(`[Error al mostrar una VENTA ] ${e}`);
        }
    })
}

function updateListaVenta(id, body) {
    return new Promise(async (resolve, reject) => {
        console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteListaVenta(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }

        const result = store.deleted(id);
        resolve(result);
    });
}

function getDataGanancias(data) {
    return new Promise((resolve, reject) => {

        try {
            const rta = queryGanancias(data);
            resolve(rta);
        } catch (error) {
            reject(error);
        }

    })
}


module.exports = {
    add: addListaVenta,
    get: getListaVenta,
    update: updateListaVenta,
    delete: deleteListaVenta,
    getDataGanancias
};