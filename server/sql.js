module.exports = new (function(){
  var sqlite3 = require('sqlite3').verbose();
  var db = 0;
  
  function error(e, result, callback){
		result.error = e;
		result.success = false;
		callback( result );
	}
	
	function report( result, querry, callback ){
		
		try{
		result = db.all( querry , function(err, rows){
			if(err)
				error(err, result, callback);
			
			result.success=true;
			result.rows = rows;
			callback(result);
		});
		
		}
		catch( e ){
			error(e, result, callback);
		}
	}

  function initSchema(){
    db.serialize(function() {
      db.run("CREATE TABLE if not exists user"+
      "(id           INTEGER        PRIMARY KEY   AUTOINCREMENT   ,"+
      "rating_giver  INTEGER        NOT NULL                      ,"+
      "rating_needer INTEGER        NOT NULL                      ,"+
      "email         STRING         NOT NULL                      )");

      db.run("CREATE TABLE if not exists  token"+
      "(id           INTEGER        REFERENCES User ( id )        ,"+
      "token         STRING                                       )");

      db.run("CREATE TABLE if not exists  plug"+
      "(id           INTEGER        PRIMARY KEY    AUTOINCREMENT  ,"+
      "lat           INTEGER        NOT NULL                      ,"+
      "lon           INTEGER        NOT NULL                      ,"+
      "rank          INTEGER        NOT NULL                      ,"+
      "description   STRING         NOT NULL                      ,"+
      "slots         INTEGER                                      )");
    });
  }
  this.init = function(dbName){
    db = new sqlite3.Database(dbName);
    initSchema();
  }

  this.testInsert = function(){
    var stmt = db.prepare("INSERT INTO User VALUES (?, ?, ?, ?)");
    for (var i = 0; i < 10; i++) {
      stmt.run( i , i , i , "@gmail.com"  );
    }
    stmt.finalize();

  }

  this.testSelect = function(){
    db.each("SELECT *  FROM User", function(err, row) {
        console.log("test row:");
        console.log(row);
        console.log(err);
    });
  }

  this.select = function( map, callback ){
	var querry= "SELECT ";
	var result = {};
	for( i in map.collect ){

		querry += ((i>0)?", ":" ") + map.collect[i];

	}
	querry += " FROM ";
	querry += map["table"];
	
	if( map.restrict != undefined ){
		
		querry += " WHERE ";

		for( i in map.restrict ){

			querry += ((i>0)?" AND ":" ")+ map.restrict[i];
		}
	}

	querry +=";";

	report( result, querry, callback );
	

	

  }

  this.insert = function( map, callback ){

		var querry = "INSERT INTO ";
		var keys = "";
		var values = "";
		var parameters = [];
		var result = {};

		querry += map["table"];

		keys +="(";
		values +="(";
		var i = 0;
		for( key in map.write){
			
			keys += ((i>0)?",":" ") + key;

			parameters.push(key);
			var addValue = map.write[key];
			if( typeof map.write[key] == "string")
				addValue = '"'+addValue+'"';
			values += ((i>0)?",":" ") + addValue;
			i++;
		}
		
		keys +=")";
		values +=")";

		querry += keys;
		querry += " VALUES ";
		querry += values;
		querry += " ;";
	
		console.log( querry );

		report( result, querry, callback );

  }

	this.update = function( map, callback ){
		
		var querry = "UPDATE ";
		var values = "";
		var match = "";
		var result = {};

		querry += map["table"];
		querry += " SET ";
	
		var i = 0;
		for( key in map.write){
			
			values += ((i>0)?",":" ") + key;
			var addValue = map.write[key];
			if( typeof map.write[key] == "string")
				addValue = '"'+addValue+'"';
			values += "=" + addValue;
			i++;
		}
		
		querry += values;
		
		if( map.match != undefined ){
		
			querry += " WHERE ";

			for( i in map.match ){
				match +=((i>0)?" AND ":" ") +i+" = "+ map.match[i];
			}
			
			querry += match;
		}
		
		querry += " ;";
	
		console.log( querry );
	
	
		report( result, querry, callback);
	}
	
	
	this.erase = function(map, callback){
		
		var querry = "DELETE FROM ";
		var match = "";
		var result = {};
		
		querry += map["table"];
		
		if( map.match != undefined ){
		
			querry += " WHERE ";

			for( i in map.match ){
				match +=((i>0)?" AND ":" ") +i+" = "+ map.match[i];
			}
			
			querry += match;
		}
		
		querry +=";";
		
		console.log( querry );
		
		report( result, querry, callback);
		
	}
	

})();
