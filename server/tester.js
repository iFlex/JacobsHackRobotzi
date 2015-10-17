//import components
//var plugs = require('./managers/plugs');
var users = require('./managers/users');
var chat = require('./managers/chat');

var sql = require("./sql");

//plugs.storeTest("T25jZSB1cG9uIGEgdGltZSBsb3JlbSBpcHN1bSBicyE=");
sql.init("test.db");
//sql.testInsert();
//sql.testSelect();


sql.insert({table:"user",write:{ rating_giver: 100, rating_needer: 0, email:"yahoo.com"}}, function(res){
	console.log("INSERT R:");
	console.log(res);
});

sql.update({table:"user", match:{ id:100 }, write:{ rating_giver: 400 }}, function(res){
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


