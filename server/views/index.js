var client = {};

client.sockets = (function() {
    var root = this;
    var socket;

    var initializeSockets = function() {
        console.log('Sockets initialized');

        var connection = location.protocol + "//" + location.hostname + ":" + location.port;
        socket = io.connect(connection);

        socket.on('connect', function() {
            console.log('Socket connected on client');
        });
    };

    var start = $(document).ready(function() {
        initializeSockets();
    });

    return {
        start: start
    };
})();

client.sockets.start;