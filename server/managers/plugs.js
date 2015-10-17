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
      fs.writeFile("store/"+fileName, buf, function (err) {
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

  function addPlug(data,callback){
    var result = {success:false}
    //check if it exists
    //sb.select()

    //insert it
    db.insert({
      table:"plug",
      set:{
        lat:data.lat,
        lon:data.lon,
        description:data.description
      }
    },function(res){
      if(!res.success){
        callback(res)
        return;
      }
      //collect id from
      console.log("Result from query");
      console.log(res);
      var imid = 0;
      storeImage(rawImage,imid+extension,function(res){
        if(!res.success){
          callback(res);
          return;
        }
        result.success = true;
        result.id = imid;
        callback(result);
      })
    });
  }

  function rateUp(data,callback){
    try {
      db.update({
        table:"plug",
        match:{
          id:data.id
        },
        set:{
          rank:"rank + 2"
        }},callback);
    } catch (e) {
      console.log("PLUGS: Error RateUp");
      console.log(e);
      callback({success:false,error:e});
    }
  }

  function rateDn(data,callback){
    try {
      db.update({
        table:"plug",
        match:{
          id:data.id
        },
        set:{
          rank:"rank - 1"
        }},callback);
    } catch (e) {
      console.log("PLUGS: Error RateDown");
      console.log(e);
      callback({success:false,error:e});
    }
  }

  function getPlugs(data,callback){
    try {
      db.select({
        table:"plug",
        collect:["id","lat","long"],
        restrict:["SQRT( POW(lat - "+data.lat+",2) + POW( lon - "+data.lon+",2)  ) < "+rad]
      },function(result) {
        if(!result.success){
          callback(result);
          return;
        }
        //send back to user

      });
    } catch (e){
      console.log("PLUGS: Error getPlugs");
      console.log(e);
      callback({success:false,error:e});
    }
  }

  function getImage = function(){

  }

  var actionToMethod = {
    add:"addPlug",
    rateUp:"rateUp",
    rateDn:"rateDn",
    get:"getPlugs",
    getImage:"getImage"
  };
})();
