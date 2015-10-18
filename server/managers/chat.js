module.exports = new (function(){
    var db = 0;
    var endpoint = "chat";
    var socketEndpoint = "/";
    //0:token,1:connection status,2:socket or counterpart
    var conversations = {};

    this.setDBController = function(dbc){
        db = dbc;
    }

    this.setSocketEndpoint = function(endpoint){
        socketEndpoint = endpoint;
    }

    this.handle = function(socket,data,callback){
        try {
            data.socket = socket;
            var handler = actionToMethod[data.action];
            ret = this[handler](data,callback);
            if(ret != 0){
                callback(ret);
                return;
            }
        } catch(e) {
            console.log("Plugs:: Error");
            console.log(e);
        }
        callback({success:false,error:e});
    }

    this.pair = function(data){
        conversations[data.left] = [data.right,0,data.socket];

        var right = conversations[data.left][0];
        if(conversations[data.left] && conversations[right]){
            conversations[data.left][1] = 1;
            conversations[right][1] = 1;
            aux = conversations[right][2];
            conversations[right][2] = conversations[data.left][2];
            conversations[data.left][2] = aux;
            //other party of success
            var info = {success:true,endpoint:endpoint,indo:"PAIRED",left:data.left,right:right}
            conversations[right][2].emit(socketEndpoint,JSON.stringify(info));
            return info;
        }
        return {success:true,endpoint:endpoint};
    }

    this.send = function(data){
        if(conversations[data.left][1] == 1){//if active
            conversations[data.left][2].emit(socketEndpoint,data);
            return 1;
        }
        return 0;
    }

    this.unpair = function(data){
        if(conversations[data.left]){
            right = conversations[data.left][0];
            delete conversations[data.left];
            delete conversations[right];
            return 1;
        }
        return 0;
    }

    var actionToMethod = {
        "pair":"pair",
        "send":"send",
        "unpair":"unpair"
    };
})();
