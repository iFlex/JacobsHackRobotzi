var user = require("./managers/users.js");

var sql = require("./sql");


sql.init("test.db");

user.setDBController(sql);

//register a new user
	user.newUser( {}, function(res){
	console.log("ADD USER R:");
	console.log(res);
});

//authenticates a user
	user.auth( {id:"tatat"}, function(res){
	console.log("AUTHENTIFOCATION R:");
	console.log(res);
});
	
//refresh user position
	user.refreshPos( {lat:15, lon:10, id:"curuletulumanz"}, function(res){
	console.log("REFRESH R:");
	console.log(res);
});

//refresh user assets
	user.refreshAssets( {id:"draganebuna", owns:[1,2,3]}, function(res){
	console.log("REFRESH ASSETS:");
	console.log(res);
});
	
//find users that have the desired chargers
	user.findHelpers( {id:"token", need:[1,2]}, function(res){
	console.log("FIND HELPERS R:");
	console.log(res);
});
