const Model = require('../model/model.js')

function addSerieVentas(serie_ventas) {

    const mySerieVenta = new Model(serie_ventas);
    mySerieVenta.save();
}

async function getSerieVentas(filterSerieVentas) {
    console.log(filterSerieVentas)
    let filter = {}
    if (filterSerieVentas !== null) {
        filter = { _id: filterSerieVentas }
    }

    const series_ventas = await Model.find(filter);
    return series_ventas;

}

async function updateSeriesVentas(id, serie) {
    console.log(body);
    const foundSerieVenta = await Model.findOne({
        _id: id
    })

    foundSerieVenta.serie = serie;
    const newSerieVenta = await foundSerieVenta.save();
    return newSerieVenta;

}

module.exports = {
    add: addSerieVentas,
    list: getSerieVentas,
    //get
    update: updateSeriesVentas
    //deleted
}