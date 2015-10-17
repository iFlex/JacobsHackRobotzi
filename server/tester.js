//import components
var plugs = require('./managers/plugs');
var users = require('./managers/users');
var chat = require('./managers/chat');
var sleep = require('sleep');
var sql = require("./sql");

//plugs.storeTest("T25jZSB1cG9uIGEgdGltZSBsb3JlbSBpcHN1bSBicyE=");
sql.init("test.db");
plugs.setDBController(sql);
console.log("testing add");
plugs.handle(null,{
  action:"add",
  image:"YWxza2ZoYXNsa2pkZnN2ZDtrLmhmYWJza2YgYWxza2pkbmFzZmxpdWRsa2FzYnp4bGNrempiIHhrLmM=",
  lat:0.5,
  lon:0.5,
  description:"boom boom",
  extensions:".jpg"
},function(result){
  console.log("Finished test");
  console.log(result);
  console.log("testing rank up");
  plugs.handle(null,{
    action:"rateUp",
    id:0
  },function(result){
    console.log("Finished test");
    console.log(result);

    console.log("testing rank down");
    plugs.handle(null,{
      action:"rateDn",
      id:0
    },function(result){
      console.log("Finished test");
      console.log(result);
      plugs.handle(null,{
            action:"get",
            lat:0.1,
            lon:0.1,
            radius:10
          },function(result){
            console.log("Finished get");
            console.log(result);
          });
    });
  })
})





