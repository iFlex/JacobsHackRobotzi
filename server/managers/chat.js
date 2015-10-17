module.exports = function(){
    var db = 0;
    var endpoint = "chat";
    var conversations = {};

    this.setDBController = function(dbc){
        db = dbc;
    }

    this.handle = function(socket,data,callback){
        try {
            var handler = actionToMethod[data.action];
            this[handler](data,callback);
        } catch(e) {
            console.log("Plugs:: Error");
            console.log(e);
            callback({success:false,error:e});
        }
    }

    this.pair = function(data,callback){

    }
    this.send = function(data,callback){

    }
    this.unpair = function(data,callback){

    }

    var actionToMethod = {
        "new":"newUser",
        "auth":"auth",
        "position":"refreshPos",
        "chargers":"refreshAssets",
        "find":"findHelpers"
    };
}
