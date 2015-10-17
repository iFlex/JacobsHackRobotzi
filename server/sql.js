module.exports = new (function(){
  var sqlite3 = require('sqlite3').verbose();
  var db = 0;

  function initSchema(){
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
})();
