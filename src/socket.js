const { Server } = require('socket.io');
const socket = {};

function connect(server, cors) {

    socket.io = new Server(server, cors);

}

module.exports = {
    connect,
    socket,
}