//import components
var plugs = require('./managers/plugs');
var users = require('./managers/users');
var chat = require('./managers/chat');

var sql = require("./sql");

//plugs.storeTest("T25jZSB1cG9uIGEgdGltZSBsb3JlbSBpcHN1bSBicyE=");
sql.init("test.db");
sql.testInsert();
sql.select({table:"user",collect:["id","email"]},function(res){
  console.log("QUERY R:");
  console.log(res);
});
