const PORT=8101;
//HTTP
var http = require('http');
var mime = require('mime');
var server = http.createServer();
var io = require('socket.io')(server);
var sql = require('./sql');

//import components
var plugs = require('./managers/plugs');
var users = require('./managers/users');
var chat = require('./managers/chat');

sql.init("database.db");
//pass db controller
plugs.setDBController(sql);
users.setDBController(sql);
chat.setDBController(sql);

var commEndpoint = "live"
io.on('connection', function (socket) {
	console.log("New connection");
	socket.on(commEndpoint, function (data) {
        console.log("data from user");
        console.log(data)
        try {
          data = JSON.parse(data);
        } catch(e) {
          console.log("ERROR PARSING DATA",e);
          return;
        }

        function sendToUser(data){
            if(data.success == true)
                //console.log("Sending back to user");
                //console.log(JSON.stringify(data));
                socket.emit(commEndpoint,JSON.stringify(data));
            else {
                console.log("ERROR PROCESSING REQUEST");
                console.log(data);
            }
        }

        switch(data.endpoint){
          case "plug":plugs.handle(socket,data,sendToUser);break;
          case "user":users.handle(socket,data,sendToUser);break;
          case "chat":chat.handler(socket,data,sendToUser);break;
        }
	});
});
//listen
server.listen(PORT, function(){
    console.log("Server listening on port:%s", PORT);
});
