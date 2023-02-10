const express = require('express');
const app = express();
const server = require('http').Server(app);
const bodyParser = require('body-parser');
const { URI, connect } = require('./db.js');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./network/routes');
const socket = require('./socket');
const path = require('path');
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

//Archivos estaticos 

app.use(express.static(path.join(__dirname, '/public/files/')))
app.use('/imagen', express.static(__dirname + '/public/files/'))

//para obtner una imagen es : http://localhost:8080/imagen/nombre del archivo;


// Servidor corriendo por el puerto 8080 
server.listen(8080, () => {

    console.log('La aplicacion esta corriendo en http://localhost:8080')

});