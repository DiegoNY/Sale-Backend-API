const db = require('mongoose');
const URI = 'mongodb://localhost:27017/basedb'

db.Promise = global.Promise;
db.set('strictQuery', false);

async function connect(url) {

    await db.connect(url, {
        useNewUrlParser: true,
    });

    const connection = db.connection;
   
    connection.once('open', () => {
        console.info(`Coneccion realizada con exito URI : ${url} `)
    });

}

module.exports = {
    URI,
    connect,
}