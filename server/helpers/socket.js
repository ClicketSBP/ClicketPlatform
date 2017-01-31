const socketio = require('socket.io'),
    Session = require('../models/Session');

const socket = (() => {
    const init = (server) => {
        let io = socketio.listen(server);

        io.sockets.on('connection', (socket) => {
            console.log("Socket connected");

            socket.emit('welcome', {
                connected: true
            });

            Session.on('start', (body) => {
                socket.emit('start', body);
            });

            Session.on('stop', (body) => {
                socket.emit('stop', body);
            });
        });
    };

    return {
        init: init
    };
})();

module.exports = socket;