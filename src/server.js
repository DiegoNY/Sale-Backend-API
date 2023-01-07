const express = require('express');
const bodyParser = require('body-parser');
const { URI, connect } = require('./db.js');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const router = require('./network/routes');

//conneccion a la base de datos

connect(URI);

var app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000'
    }

});

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//router siempre al final

router(app)













//Prueba de socket io 
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
})

app.get('/codigosBarra', (req, res) => {
    let data = [
        { id: "", numero: '000002' },
        { id: "", numero: '000002' },
        { id: "", numero: '00005' }
    ]
    res.send(data);


})


io.on("connection", socket => {

    // console.log("Clientes conectados " + io.engine.clientsCount)
    // console.log("Id Socket conectado " + socket.id);

    socket.on('message', (message) => {

        data = [
            { id: "", numero: '000002' },
            { id: "", numero: '000002' },
            { id: "", numero: '00005' }
        ]
        console.log(message)

        socket.broadcast.emit('message', data)
    })


});

// Servidor corriendo por el puerto 8080 
httpServer.listen(8080);
console.log('La aplicacion esta corriendo en http://localhost:8080')