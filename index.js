var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users = {};
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	io.emit('all user', JSON.stringify(users));
	socket.on('auth', function(msg){
		users[socket.id] = msg;
		io.emit('new user', '<span>'+msg+'</span> подключился к чату');
		io.emit('all user', JSON.stringify(users));
	});
	socket.on('disconnect', function(){
		if(users[socket.id] != undefined){
			io.emit('exit user', '<span>'+users[socket.id]+'</span> вышел из чата');
			delete users[socket.id];
			io.emit('all user', JSON.stringify(users));
		}
	});
	socket.on('chat message', function(msg){
		io.emit('chat message', '<b>'+users[socket.id]+': </b>'+msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
    