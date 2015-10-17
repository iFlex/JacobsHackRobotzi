//packet structure
// .action = add|rateUp|rateDn|get
module.exports = new (function(){
  var STORE_LOCATION = "store/";
  var db = 0;
  var imgIndex = 0;
  this.setDBController = function(dbc){
    db = dbc;
    db.select({
      table:"plug",
      collect:["COUNT(id) as MAX_INDEX"]
    },function(result){
      if(result.success == true){
        console.log("Found largest record");
        console.log(result);
        imgIndex = result.rows[0]["MAX_INDEX"] || 0;
      }
    })
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

  function storeImage(rawImage,fileName,callback){
    var buf = new Buffer(rawImage, 'base64');
    var fs = require("fs");
    var result = {success:false};
    try {
      fs.writeFile(STORE_LOCATION+fileName, buf, function (err) {
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
    var result = {success:false}
    //check if it exists
    //sb.select()

    //insert it
    db.insert({
      table:"plug",
      write:{
        id:imgIndex,
        lat:data.lat,
        lon:data.lon,
        description:data.description
      }
    },function(res){
      if(!res.success){
        callback(res);
        return;
      }
      //collect id from
      console.log("Result from query");
      console.log(res);
      var imid = imgIndex++;
      var extension = ".txt";
      storeImage(data.image,imid+extension,function(res){
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

  this.rateUp = function(data,callback){
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

  this.rateDn = function(data,callback){
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

  this.getPlugs = function(data,callback){
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

  this.getImage = function(d,callback){
    try {
      var data = fs.readFileSync(STORE_LOCATION+d.id+".jpeg");
      var base64data = new Buffer(data).toString('base64');
      var result = {success:true,image:base64data};
      callback(result);
    } catch(e){
      consle.log("PLUG: Could not read file "+fileName);
      console.log(e);
      callback({success:false,error:e})
    }
  }

  var actionToMethod = {
    add:"addPlug",
    rateUp:"rateUp",
    rateDn:"rateDn",
    get:"getPlugs",
    getImage:"getImage"
  };
})();
