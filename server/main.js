const PORT=8101;
//HTTP
var http = require('http');
var mime = require('mime');
var server = http.createServer();
var io = require('socket.io')(server);

//import components
var plugs = require('./managers/plugs');
var users = require('./managers/users');
var chat = require('./managers/chat');

io.on('connection', function (socket) {
	console.log("New connection");
	socket.on('/', function (data) {
    console.log("data from user");
    console.log(data)
    try {
      data = JSON.parse(data);
    } catch(e){
      console.log("ERROR PARSING DATA",e);
      return;
    }
    
    switch(data.endpoint){
      case "plug":plugs.handle(socket,data);break;
      case "user":users.handle(socket,data);break;
      case "chat":chat.handler(socket,data);break;
    }
	});
});
//listen
server.listen(PORT, function(){
    console.log("Server listening on port:%s", PORT);
});
