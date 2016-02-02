var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

  db.run('CREATE TABLE "users" ' +
           '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"username" VARCHAR(255), ' +
           'password VARCHAR(255))', function(err) {
      if(err !== null) {
        console.log(err);
      }

  // var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
  // for (var i = 0; i < 10; i++) {
  //     stmt.run("Ipsum " + i);
  // }
  // stmt.finalize();

  // db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
  //     console.log(row.id + ": " + row.info);
  // });
});

// db.close();