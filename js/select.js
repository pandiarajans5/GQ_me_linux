var sqlite3 = require('sqlite3').verbose();  
var db_name = "GQMessenger.db";  
var users = new Array();
var uname = "par";
var upwd = "par";
var db = new sqlite3.Database(db_name);  
/*db.run('CREATE TABLE "User_Login" ' +
           '("uid" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
           '"user_name" VARCHAR(255), ' +
           'user_pwd VARCHAR(255))', function(err) {
      if(err !== null) {
        console.log(err);
      }
 });
console.log("Table Created");*/

/*db.all("SELECT user_name FROM User_Login", function(err, rows) {  
        rows.forEach(function (row) {  
            console.log(row.user_name);  
            users.push(row.user_name);
        })  
    });*/
//var query="INSERT into User_Login(user_name,user_pwd) VALUES ("+uname+","+upwd+")";
//if(!users.contains(uname)) {
    db.run('INSERT into User_Login(user_name,user_pwd) VALUES (?,?)',uname,upwd,function(err){
    	if(err !== null) {
    		console.log(err);
    	}

    });
    console.log("Data Created");
//}
//else {
//	console.log('Already Exists');
//}
db.close();