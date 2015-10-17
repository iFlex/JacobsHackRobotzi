const PORT=8080;
//HTTP
var http = require('http');
var mime = require('mime');
var server = http.createServer();
var io = require('socket.io')(server);

//import components
var plugs = require('managers/plugs.js');
var users = require('managers/users.js');
var chat = require('managers/chat.js');


io.on('connection', function (socket) {
	console.log("New connection");
	socket.on('/', function (data) {
    console.log("data from user");
    console.log(data)
    try {
      data = JSON.parse(data);
      data.server = "booyah!";
      data = JSON.stringify(data);
      socket.emit('loop',data);
    } catch(e){
      console.log("ERROR PARSING DATA",e);
    }
	});
});

//listen
server.listen(PORT, function(){
    console.log("Server listening on port:%s", PORT);
});
