var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('database.db');

db.serialize(function() {
  db.run("CREATE TABLE if not exists User"+ 
	"(id           INTEGER        PRIMARY KEY   AUTOINCREMENT   ,"+
	"rating_giver  INTEGER        NOT NULL                      ,"+ 
	"rating_needer INTEGER        NOT NULL                      ,"+
	"email         STRING         NOT NULL                      )");
	
	db.run("CREATE TABLE if not exists  Token"+
	"(id           INTEGER        REFERENCES User ( id )        ,"+
	"token         STRING                                       )");
	
	db.run("CREATE TABLE if not exists  PLUG"+
	"(id           INTEGER        PRIMARY KEY    AUTOINCREMENT  ,"+
	"lat           INTEGER        NOT NULL                      ,"+
	"lung          INTEGER        NOT NULL                      ,"+
	"rank          INTEGER        NOT NULL                      ,"+
	"description   STRING         NOT NULL                      ,"+
	"photo_url     STRING         NOT NULL                      ,"+
	"number        INTEGER                                      )");

	var stmt = db.prepare("INSERT INTO User VALUES (?, ?, ?, ?)");
	for (var i = 0; i < 10; i++) {
		stmt.run( i , i , i , "@gmail.com"  );
	}
	stmt.finalize();
  
	db.each("SELECT *  FROM User", function(err, row) {
      console.log("test row:");
      console.log(row);
      console.log(err);
  });
});

db.close();
