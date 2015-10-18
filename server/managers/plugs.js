//packet structure
// .action = add|rateUp|rateDn|get
module.exports = new (function(){
  var STORE_LOCATION = "store/";
  var db = 0;
  var imgIndex = 0;
  var endpoint = "plug";
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

  function storeImage(rawImage,fileName,callback){
    var buf = new Buffer(rawImage, 'base64');
    var fs = require("fs");
    var result = {success:false};
    try {
      fs.writeFile(STORE_LOCATION+fileName, buf, function (err) {
        if (err) throw err;

        console.log('It\'s saved! in same location.');
        result.success = true;
        result.endpoint = endpoint;
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
    //TMP
    db.select({
      table:endpoint,
      collect:["COUNT(id) as MAX_INDEX"]
    },function(result){
      if(result.success == true){
        console.log("Found largest record");
        console.log(result);
        imgIndex = result.rows[0]["MAX_INDEX"] || 0;
        doInsert();
      }else{
        callback({success:false,error:result.error});
      }
    });

    function doInsert(){
       //insert it
           db.insert({
             table:endpoint,
             write:{
               id:imgIndex,
               lat:data.lat,
               lon:data.lon,
               rank:0,
               slots:data.slots || 1,
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
             var extension = ".jpeg";
             storeImage(data.image,imid+extension,function(res){
               if(!res.success){
                 callback(res);
                 return;
               }
               result.success = true;
               result.endpoint = endpoint;
               result.id = imid;
               callback(result);
             })
           });
    }
  }

  this.rateUp = function(data,callback){
    try {
      db.update({
        table:endpoint,
        match:{
          id:data.id
        },
        write:{
          rank:["rank + 2"]
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
        table:endpoint,
        match:{
          id:data.id
        },
        write:{
          rank:["rank - 1"]
        }},function(r){
        r.endpoint = endpoint;
        callback(r);
        ///////////////////////////////
        db.erase({
          table:endpoint,
          restrict:["rank < 0"]
        },function(res){
          if(!res.success)
            console.log("Could not delete sockets that have negative rank");
        });
      });
    } catch (e) {
      console.log("PLUGS: Error RateDown");
      console.log(e);
      callback({success:false,error:e});
    }
  }

  this.getPlugs = function(data,callback){
    try {
      db.select({
        table:endpoint,
        collect:["*"],
        restrict:["(lat - "+data.lat+")*(lat - "+data.lat+") + (lon - "+data.lon+")*(lon - "+data.lon+") <"+(data.radius*data.radius)]
      },function(result) {
        if(!result.success){
          callback(result);
          return;
        }
        ////////////////
        result.endpoint = endpoint;
        callback(result);
      });
    } catch (e){
      console.log("PLUGS: Error getPlugs");
      console.log(e);
      callback({success:false,error:e});
    }
  }

  this.getImage = function(d,callback){
    db.select({
      table:endpoint,
      collect:["*"],
      restrict:["id = "+d.id]
    },function(result) {
      if(!result.success){
        callback(result);
        return;
      }
      ////////////////
      result.endpoint = endpoint;
      fillInFile(result,d);
      callback(result);
    });

    function fillInFile(result,d){
      var fileName = STORE_LOCATION+d.id+".jpeg"
      try {
        var fs = require("fs");
        var data = fs.readFileSync(fileName);
        var base64data = new Buffer(data).toString('base64');
        result.image = base64data;
      } catch(e){
        console.log("PLUG: Could not read file "+fileName);
        console.log(e);
        callback({success:false,error:e})
      }
    }
  }

  var actionToMethod = {
    add:"addPlug",
    rateUp:"rateUp",
    rateDn:"rateDn",
    "get":"getPlugs",
    getImage:"getImage"
  };
})();
