module.exports = new (function(){
    var db = 0;
    var endpoint = "chat";
    //0:token,1:connection status,2:socket or counterpart
    var conversations = {};

    this.setDBController = function(dbc){
        db = dbc;
    }

    this.handle = function(socket,data,callback){
        try {
            data.socket = socket;
            var handler = actionToMethod[data.action];
            this[handler](data,callback);
        } catch(e) {
            console.log("Plugs:: Error");
            console.log(e);
            callback({success:false,error:e});
        }
    }

    this.pair = function(data,callback){
        conversations[data.left] = [data.right,0,data.socket];

        var right = conversations[data.left];
        if(conversations[data.left] && conversations[right]){
            conversations[data.left][1] = 1;
            conversations[right][1] = 1;
            aux = conversations[right][2];
            conversations[right][2] = conversations[data.left][2];
            conversations[data.left][2] = aux;
        }
    }
    this.send = function(data,callback){
        if(conversations[data.left][1] == 1){//if active

        }
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
})();
