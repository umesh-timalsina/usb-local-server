'use strict';
const http = require('http');
const socketIO = require('socketio');
class SocketServer {
    constructor(port){
        const PORT = 8089
        var server = http.createServer();
        this.port = port || PORT;
        var io = socketIO.listen(server);
        io.sockets.on('connection', function(conn){
            console.log('A new connection....');
            conn.emit('message', 'Connected');

            conn.on('disconnect', () => {
                console.log('Client disconnected');
            });
        });
        server.listen(this.port);
        console.log('Server started to listen on `${this.port}`');
        return io.sockets;
    }
}

module.exports = SocketServer;