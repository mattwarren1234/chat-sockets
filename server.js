var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connect = require('connect');
var serveStatic = require('serve-static');
var port = process.env.PORT || 3000;
app.use(serveStatic(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

var users = [
];
io.on('connection', function(socket) {
    socket.on('disconnect', function() {
        for (var i =0; i < users.length; i++){
            if (users[i].id === socket.id){
                io.emit('user left', users[i].name);
                users.splice(i, 1);
                break;
            }
        }
    });
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });
    
    socket.on('add user', function(username) {
        console.log(username + 'added');
        users.push({id: socket.id, name: username});
        io.emit('new user', username);
        io.emit('user list', users.map(function(user){return user.name;}));
    });
});

http.listen(port, function() {
    console.log('listening on *:3000!');
});
 