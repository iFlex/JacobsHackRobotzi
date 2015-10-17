module.export = function(){
    var db = 0;
    var endpoint = "user";
    this.setDBController = function(dbc){
        db = dbc;
    }

    this.handle socket,data,callback){
        try {
            var handler = actionToMethod[data.action];
            this[handler](data,callback);
        } catch(e) {
            console.log("Plugs:: Error");
            console.log(e);
            callback({success:false,error:e});
        }
    }

    function makeToken(length){
        token = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0;i<length;++i)
            token += possible.charAt(Math.floor(Math.random() * possible.length));

        return token;
    }

    //register a new user
    this.newUser = function(data,callback){
        var token = makeToken(64);
        db.insert({
           table:endpoint,
           write:{
            id:token,
            lat:0,
            lon:0,
            email:"unknown@gmail.com",
           },function(res){
             if(!res.success){
               callback(res);
               return;
             }
             res.endpoint = endpoint;
             res.id = token;
             callback(res);
           })
        });
    }
    //authenticates a user
    this.auth = function(data,callback){
        db.select({
            table:"user",
            collect:["id"],
            restrict:['id = "' + data.token + '"']
        },function(result){
            if(result.success == true){
                result.endpoint = endpoint;
                callback(result);
            } else {
                callback(result);
            }
        });
    }
    //refresh user position
    this.refreshPos = function(data,callback){
        db.update({
           table:endpoint,
           match:{id:data.id}
           write:{
            lat:data.lat,
            lon:data.lon
           },function(res){
             if(!res.success){
               callback(res);
               return;
             }
             res.endpoint = endpoint;
             res.id = token;
             callback(res);
           })
        });
    }
    //refreshes what chargers the user owns
    this.refreshAssets = function(data,callback){

    }
    //find users that have the desired chargers
    this.findHelpers = function(data,callback){
        db.select({
            table:"charger",
            collect:["user"],
            restrict:["id IN ("+data.need.join(",")+")"]
        }},function(result){
            if(result.success == true){
                //extract
                var users = []
                for( k in result.rows )
                    users.push(results.rows[k].user);
                //query for users
                db.select({
                    table:endpoint,
                    collect:["*"],
                    restrict:["id IN ("+users.join(",")+")"]
                },function(result){
                    if(result.success == true){
                        result.endpoint = endpoint;
                        callback(result);
                    } else {
                        callback(result);
                    }
                });
            } else {
                callback(result);
            }
        });
    }

    var actionToMethod = {
        "new":"newUser",
        "auth":"auth",
        "position":"refreshPos",
        "chargers":"refreshAssets",
        "find":"findHelpers"
    };
}
