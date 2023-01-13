const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const { URI, connect } = require('./db.js');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./network/routes');
const socket = require('./socket');
//conneccion a la base de datos
connect(URI);


socket.connect(server, {
    cors: {
        origin: '*'
    }
})


app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//router siempre al final

router(app)


// Servidor corriendo por el puerto 8080 
server.listen(8080, () => {

    console.log('La aplicacion esta corriendo en http://localhost:8080')

});