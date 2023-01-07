const socket = io();

socket.on("connect", () => {
    console.log("El socket se a conectado" + socket.id);
})

socket.on("disconnect" ,() => {
    console.log("El socket se a desconectado" + socket.id);
})