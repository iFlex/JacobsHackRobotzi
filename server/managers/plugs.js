//packet structure
// .action = add|rateUp|rateDn|get
module.exports = new (function(){

  var db = 0;
  this.setDBController = function(dbc){
    db = dbc;
  }

  this.handle = function(socket,data,callback){
    try {
      var handler = actionToMethod[data.action];
      handler(data,callback);
    } catch(e) {
      console.log("Plugs:: Error");
      console.log(e);
      //callback({success:false,error:e});
    }
  }

  function storeImage(rawImage,fileName,callback){
    var buf = new Buffer(rawImage, 'base64');
    var fs = require("fs");
    var result = {success:false};
    try {
      fs.writeFile(fileName, buf, function (err) {
        if (err) throw err;

        console.log('It\'s saved! in same location.');
        result.success = true;
        callback(result);
      });
    } catch (e){
      result.error = e;
      callback(result);
    }
  }
  this.storeTest = function(data){
    storeImage(data,"test.txt",console.log);
  }
  this.addPlug = function(data,callback){
    //add coordinates
    imgid
  }
  this.rateUp = function(data,callback){

  }
  this.rateDn = function(data,callback){

  }
  this.getPlugs = function(data,callback){

  }

  var actionToMethod = {
    add:"addPlug",
    rateUp:"rateUp",
    rateDn:"rateDn",
    get:"getPlugs"
  };
})();
