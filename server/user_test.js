var user = require("./manage/users.js");

//register a new user
	user.newUser(data, callback);

//authenticates a user
	user.auth();
	
//refresh user position
	user.refreshPos();
	
//refreshes what chargers the user owns
	user.refreshAssets()
	
//find users that have the desired chargers
	user.findHelpers()
