var http = require('http');
socketIO = require('socket.io');
fs = require('fs');

// if using express framework, we can define router easier!
var server = http.createServer(function (req, res) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        res.writeHead(200);
        res.end(data);
    });
});

// The above code is used for create a server to serve the static index.html file under the current directory. The following part is the main idea of how to use socket.io to construct and listen to events.
server.listen(3000);
console.log('listen on http://localhost:3000');

var players = [];
io = socketIO(server);

io.on('connection', function (socket) {
    socket.emit('greeting-from-server', {
        greeting: 'Hello client!',
        data: players
    });

    socket.on('greeting-from-client', function (msg) {
        console.log(msg);
    });

    socket.on('message', function (msg) {
        // console.log(msg);
        if (msg.type == 'move') {
            io.sockets.emit('message', msg);
        } else if (msg.type == 'add') {
            players.push(msg.data);
            io.sockets.emit('message', msg);
            console.log(" Now " + players.length + " players");
        } else if (msg.type == 'status') {
            var player = msg.data;
            players.forEach(function (p) {
                if (p.id == player.id) {
                    p.x = player.x;
                    p.y = player.y;
                    p.role = player.role;
                    p.name = player.name;
                    p.talk = player.talk;
                    p.direct = player.direct;
                    //console.log(p);
                }
            });
            io.sockets.emit('message', {
                type: 'status',
                data: players
            });
        } else if (msg.type == 'remove') {
            io.sockets.emit('message', msg);
            players.forEach(function (p) {
                if (p.id == msg.data) {
                    players.remove(p);
                    console.log(" Now " + players.length + " players");
                    return;
                }

            });
        } else if (msg.type == 'talk') {
            io.sockets.emit('message', msg);
        }
    });
});
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};