const historial = [];

function getHistorial() {
    return historial;
}

function addVenta(venta) {
    historial.push(venta);
}

module.exports = {
    getHistorial, addVenta
}