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
      "(id           STRING         PRIMARY KEY                   ,"+
      "rating_giver  INTEGER        DEFAULT 0                     ,"+
      "rating_needer INTEGER        DEFAULT 0                     ,"+
      "lat           REAL           NOT NULL                      ,"+
      "lon           REAL           NOT NULL                      ,"+
      "email         STRING         NOT NULL                      )");

      db.run("CREATE TABLE if not exists  plug"+
      "(id           INTEGER        PRIMARY KEY    AUTOINCREMENT  ,"+
      "lat           REAL           NOT NULL                      ,"+
      "lon           REAL           NOT NULL                      ,"+
      "rank          INTEGER        DEFAULT 0                     ,"+
      "description   STRING         NOT NULL                      ,"+
      "slots         INTEGER        DEFAULT 1                     )");
      
      db.run("CREATE TABLE if not exists charger"+
      "(id           INTEGER        PRIMARY KEY    AUTOINCREMENT  ,"+
      "model         STRING         NOT NULL                      ,"+
      "description   STRING         NOT NULL                      ,"+
      "user          STRING         REFERENCES user (id)          )");
      
      db.run("CREATE TABLE if not exists conversation"+
      "(token_helper STRING        REFERENCES user (id)           ,"+
      "token_needer  STRING         REFERENCES user (id)           )");
      
    });
  }
  this.init = function(dbName){
    db = new sqlite3.Database(dbName);
    initSchema();
  }

  this.testInsert = function(){
    var stmt = db.prepare("INSERT INTO user VALUES (?, ?, ?, ?)");
    for (var i = 0; i < 10; i++) {
      stmt.run( i , i , i , "@gmail.com"  );
    }
    stmt.finalize();

  }

  this.testSelect = function(){
    db.each("SELECT *  FROM user", function(err, row) {
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
			else if( typeof map.write[key] =="array"){
				
				addValue = map.write[key].join(" ");
			}
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

			for( i in map.restrict ){
				match +=((i>0)?" AND ":" ") +map.restrict[i];
			}
			
			querry += match;
		}
		
		querry +=";";
		
		console.log( querry );
		
		report( result, querry, callback);
		
	}
		
	

})();
