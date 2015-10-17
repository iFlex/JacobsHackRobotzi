var plugs = require('./managers/plugs');
var users = require('./managers/users');
var chat = require('./managers/chat');

var sql = require("./sql");

sql.init("test.db");

sql.insert({table:"user",write:{ rating_giver: 100, rating_needer: 0, email:"yahoo.com"}}, function(res){
	console.log("INSERT R:");
	console.log(res);
});

sql.update({table:"user", match:{ id:7 }, write:{ rating_giver: 400 }}, function(res){
	console.log("UPDATE R:");
	console.log(res);
});

sql.erase({table:"user", match:{ id:100 }}, function(res){
	
	console.log("ERASE R:");
	console.log(res);
}); 

sql.select({table:"user",collect:["*"], restrict:["1=1"]},function(res){
  console.log("QUERY R:");
  console.log(res);
});
