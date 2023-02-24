const store = require('../database/store.js');
const hoy = new Date();
let fecha = hoy.toLocaleDateString("es-ES", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})

function addProducto(productoData, file) {

    return new Promise((resolve, reject) => {
        if (!productoData.codigo_barras) {
            console.error('[messageController] No contiene codigo barras ')
            return reject('El codigo barras es requerido')
        }

        // console.log(file)
        // console.log("Si tiene file")
        let fileUrl = '';
        if (file) {
            //cambiar url por la carpeta en la que se sirven los estaticos 
            fileUrl = 'http://192.168.1.110:8080/imagen/' + file.filename;
        }

        const producto = {
            codigo_barras: productoData.codigo_barras,
            descripcion: productoData.descripcion,
            fecha_registro: productoData.fecha_registro,
            descuento: productoData.descuento || 0,
            estado: productoData.estado,
            estatus: 1,
            foto_producto: fileUrl,
            id_laboratorio: productoData.id_laboratorio,
            precio_compra: productoData.precio_compra,
            precio_compra_caja: productoData.precio_compra_caja,
            precio_compra_tableta: productoData.precio_compra_tableta,
            precio_venta: productoData.precio_venta,
            precio_venta_caja: productoData.precio_venta_caja,
            precio_venta_tableta: productoData.precio_venta_tableta,
            stock: productoData.stock,
            stock_minimo: productoData.stock_minimo,
            tipo: productoData.tipo,
            fecha_registro: fecha,
            venta_sujeta: productoData.venta_sujeta,
            stock_caja: productoData.stock_caja,
            stock_tableta: productoData.stock_tableta,
            fecha_consultas: new Date()

        }

        const response = store.add(producto);
        resolve(response);

    })

}

function getProducto(filterCodigoBarra, recientes, ventas, stockBajo, stockReporte, kardex, stock_minimo, reporteGanancias) {

    return new Promise((resolve, rejec) => {
        resolve(store.list(filterCodigoBarra, recientes, ventas, stockBajo, stockReporte, kardex, stock_minimo, reporteGanancias));
    })
}

function updateProducto(id, body) {
    return new Promise(async (resolve, reject) => {
        // console.log(id, body)
        if (!id || !body) {
            return reject('Los datos son invalidos')
        }
        const result = store.update(id, body);
        resolve(result);
    })
}

function deleteProducto(id) {
    return new Promise(async (resolve, reject) => {
        if (!id) {
            return reject('Los datos son invalidos');
        }

        const result = store.deleted(id);
        resolve(result);
    });
}


module.exports = {
    add: addProducto,
    get: getProducto,
    update: updateProducto,
    delete: deleteProducto,
};