var server = require('net').createServer();		//Crearte Server
server.listen('4568');		//Make the server to listen in the port 4568
var nou = 0;	//Number of users
var users = new Map();
var clientname,uname;
var nickName;
var name = new Array();
var userslist;

var sqlite3 = require('sqlite3').verbose();  
var db_name = "GQMessenger.db";
var db = new sqlite3.Database(db_name); 

server.on('listening',function(){
	console.log("Server listening on port 4568");
});

server.on('connection',function(socket){
 socket.setEncoding('utf8');

	
	
var flag = 'false';



	socket.on('data',function(chunk){
    console.log(chunk);
	if(flag == 'false')
	{
			var nickName;
			var usercheck;
			var user_pass_split = chunk.split(" ");
			nickName = "/nick"+user_pass_split[0];

        	db.all("SELECT count(user_name) AS usercount FROM User_Login WHERE user_name = '"+ user_pass_split[0]+"'", function(err, rows) {  
        		if(err !== null) {
    							console.log(err);
    					}else{
    						usercheck=rows[0].usercount;
							next(usercheck);
    					}
   			 });
			
			function next(myval){
				
				
				if(myval==0)
				{
					console.log(myval);
					  db.run('INSERT into User_Login(user_name,user_pwd,reg_time) VALUES (?,?,CURRENT_TIMESTAMP)',user_pass_split[0],user_pass_split[1],function(err){
    					if(err !== null) {
    							console.log(err);
    					}else{
							users.set(nickName,socket);		//Map nickName and socket
							socket.nickname = nickName;	//Assign new property to the socket(nickname)
							flag = users.has(nickName);	//Check whether the registration successfull	
							socket.write("Sucessfully added to chat room\n");	//Welcome the client
							name.push(nickName);
							
    						console.log("Data inserted");
    					}
			    	

					

   					 });
				}
				else 
				{
console.log("hi");					
					db.all("SELECT count(user_name) AS usercheckcount FROM User_Login WHERE user_name = '"+user_pass_split[0]+"' AND user_pwd ='"+user_pass_split[1]+"'", function(err, rows) {  
        		if(err !== null) {
    							console.log(err);
    					}else{
    						var usercheck1=rows[0].usercheckcount;
							console.log(usercheck1);
							if(usercheck1==1){
								users.set(nickName,socket);		//Map nickName and socket
							socket.nickname = nickName;	//Assign new property to the socket(nickname)
							flag = users.has(nickName);	//Check whether the registration successfull	
							socket.write("Sucessfully added to chat room\n");	//Welcome the client
							name.push(nickName);
							}else{
								//socket.write("Nick Name already exsit. Choose different Name");
								socket.write("User name or Password Incorrect");
							}
							
    					}
   			 });
								
				}
			}
	}
	else
	{
		if(chunk == "Redirected")
		{
			
			userslist = users.keys();
					nou = users.size;
					console.log(nou);
					users.forEach(userAdded);
					function userAdded(value,key)
					{
						
						value.write(name+" ");
					}
					
		}

		else
		{
			var redir = new RegExp(/^@redrive [a-zA-Z]/);
			var msg_test=redir.test(chunk);
		if(msg_test){
			var fuser=this.nickname.substr(5);
			var touser=chunk.split(" ");
			var tuser=touser[1];
			var users_ids=[];
			console.log(fuser);
			console.log(tuser);
			
			var fromUser = '<html> <font color="red">' + fuser +":" +'</font></html>';
			db.all("SELECT uid FROM User_Login where user_name IN ('"+fuser+"','"+tuser+"')", function(err, rows) {  
         				rows.forEach(function (row) {  
          					console.log('Users id:' + row.uid);	
							users_ids.push(row.uid);
                		})  
                		getMessages(users_ids);
					});
					
						function getMessages(users_ids) {
  						var from_userid = users_ids[0];
  						var to_userid = users_ids[1];
  						db.all("SELECT msg,chat_time FROM Messages WHERE from_user_id = '"+from_userid+"' AND to_user_id = '"+to_userid+"' OR from_user_id = '"+to_userid+"' AND to_user_id = '"+from_userid+"' ",function(err, rows){
                			rows.forEach(function (row) {  
          					socket.write('<html><li class="media"></html>' +row.msg+
							'<html> <font color="gray" size="0.5px">' + row.chat_time  +'</font></li><hr></html>');
              			});
					});
					}
		}
		else{
			var dt = new Date();
			var utcDate = dt.toLocaleTimeString();
		
			var check_msg = new RegExp(/^@/);
			
			var msg_type = check_msg.test(chunk);
			
			if(msg_type != true)
			{
				var username = this.nickname;
				username = username.substr(5);
				users.forEach(msg);
				function msg(value,key)
				{
					var uname='<html> <font color="blue">' + username  +":" +'</font></html>';
					value.write(uname+chunk+'<html> <font color="gray" size="0.5px" align="right">' + utcDate  +'</font></html>');
				
				}
			}
			else
			{
				chunk = chunk.toString();
				var privateMsg = [];
				var unicast = chunk.split(" ");
				var toUser = unicast[0].replace(/^@/,'');
				var testUser = "/nick"+toUser;
				var users_id = [];
				for(var i=0;i<unicast.length;i++)
				{
					privateMsg[i] = unicast[i+1];
				}
				//var msg123 = (privateMsg.toString()).replaceall(',',' ');
				var toMsg = toUser+":"+(privateMsg.toString()).replace(/,/g,' ');
				console.log("Message" + toMsg);
				if(users.has(testUser))
				{
					var client_name = users.get(testUser);
					var fromUser = '<html> <font color="red">' + this.nickname.substr(5) +":" +'</font></html>';
					
					//To get from user id and to user id
					db.all("SELECT uid FROM User_Login where user_name IN ('"+this.nickname.substr(5)+"','"+toUser+"')", function(err, rows) {  
         				rows.forEach(function (row) {  
          					console.log('Users id:' + row.uid);	
							users_id.push(row.uid);
                		})  
                		//console.log(rows);
                		nextInsert(users_id);
					});

					function nextInsert(users_id) {
  						var from_uid = users_id[0];
  						var to_uid = users_id[1];
  						console.log("From" + from_uid);
  						console.log("To" + to_uid);
  						db.run('INSERT into Messages(from_user_id,to_user_id,msg,chat_time) VALUES (?,?,?,CURRENT_TIMESTAMP)',from_uid,to_uid,toMsg,function(err){
                			if(err !== null) {
                  			console.log(err);
                			}
                		console.log('Messages Inserted successfully');
              			});
					}
     				//console.log('To user' + toUser);
     				
     				// To get to user id
     				/*db.all("SELECT uid FROM User_Login where user_name ='"+toUser+"'", function(err, rows) {  
         				rows.forEach(function (row) {  
          				//   console.log(row.user_name);
						console.log('To User id:' + row.uid);	
						to_uid = row.uid;
         				})  
     				});*/
     				
     				/*if(from_uid !== null && to_uid !== null) {
						db.run('INSERT into Messages(from_user_id,to_user_id,msg,chat_time) VALUES (?,?,?,CURRENT_TIMESTAMP)',from_uid,to_uid,toMsg,function(err){
    						if(err !== null) {
    							console.log(err);
    						}
    						console.log('Messages Inserted successfully');
    					});
					}*/
					
					client_name.write(fromUser + privateMsg.join(' ')+"\t\t\t\t"+utcDate);
					this.write(fromUser + ">" + '<html> <font color="green">' +testUser.substr(5) +":" +'</font></html>' +privateMsg.join(' ')+'<html> <font color="gray" size="0.5px" align="right">' + utcDate  +'</font></html>');

				}
				
			}
		}	
		}
				
	}

	});

	socket.on('error',function(err){
		console.log(err.message);
		
		
	});
	
//When connection close, remove the user from the list and intimate to others in the room
	socket.on('disconnect',function(){
	console.log("ending");
		users.delete(nickName);
		var i = name.indexOf(nickName);
		if(i!=-1)
		{
			name.splice(i,1);
		}
		//name.remove(nickName);
		users.forEach(exit);
		function exit(value,key){
			value.write(name+" ");
		}
	});

	
});