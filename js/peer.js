var server = require('net').createServer();		//Crearte Server
server.listen('4568');		//Make the server to listen in the port 4568
var nou = 0;	//Number of users
var users = new Map();
var clientname,uname;
var nickName;
var name = new Array();
var userslist;
var fs = require("fs");
server.on('listening',function(){
	console.log("Server listening on port 4568");
});

server.on('connection',function(socket){
 socket.setEncoding('utf8');

	
	
var flag = false;



	socket.on('data',function(chunk){
		 // console.log(flag);
		 // console.log(typeof(flag));
	if(flag == false)
	{

			var nickName;
			var user_pass_split = chunk.split(" ");
			nickName = "/nick"+user_pass_split[0];
			// console.log(nickName);
				if(!users.has(nickName))
				{
					
			    	
			       	// flag = users.has(nickName);	//Check whether the registration successfull	
			       	// this.write("Sucessfully added to chat room\n");	//Welcome the client
					// Writing...
					// var mydata={};
					// var myval= " username:"+user_pass_split[0] + ',' + "password:"+user_pass_split[1]
					// mydata["username"]=user_pass_split[0];
					// mydata["password"]=user_pass_split[1];
					// var s=JSON.stringify(mydata);
					// fs.appendFile( "mydb.json", mydata, "utf8", function(err){
					// });
					//var jsonObj = require("./mydb.json");
					//console.log(jsonObj);
					//read
					// fs.readFile("mydb.txt","utf8", function (err, data) {
						
					var data = fs.readFileSync('mydb.txt').toString();
					  // if (err) throw err;
					  console.log(data);
					 var usernames= data.split(" ");
					  for(i=0;i<usernames.length;i++){
					  	var singlename=usernames[i].split(",");
					  	var singlenameval=singlename[0].split(":");
					  //	console.log(singlenameval[1]);
					  	if(user_pass_split[0].localeCompare(singlenameval[1])==0){

					  		flag=false;	
					  		console.log("if");
					  		socket.write("Nick Name already exsit. Choose different Name");	
					  		break;
					  	}else{
					  		console.log("else");
					  		flag=true;
					  		
					  	}
					  }
					   // });
					 console.log(flag);
					  if(flag==true){

					  	users.set(nickName,socket);		//Map nickName and socket
			       		socket.nickname = nickName;	//Assign new property to the socket(nickname)
			       		name.push(nickName);

					  	socket.write("Sucessfully added to chat room\n");	//Welcome the client
					}	
 					
					 // name.push(nickName);
				}
				// else 
				// {
				// 	socket.write("Nick Name already exsit. Choose different Name");			
				// }
	}
	else
	{
		if(chunk == "Redirected")
		{
			
			userslist = users.keys();
					nou = users.size;
					console.log(nou);
					console.log(name);
					users.forEach(userAdded);
					
					function userAdded(value,key)
					{
						value.write(name+" ");
					}
					
		}

		else
		{
		
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
				for(var i=0;i<unicast.length;i++)
				{
					privateMsg[i] = unicast[i+1];
				}
				//var msg123 = (privateMsg.toString()).replaceall(',',' ');
				var toMsg = privateMsg.toString();
				if(users.has(testUser))
				{
					var client_name = users.get(testUser);
					var fromUser = '<html> <font color="red">' + this.nickname.substr(5) +":" +'</font></html>';
					client_name.write(fromUser + privateMsg.join(' ')+"\t\t\t\t"+utcDate);
					this.write(fromUser + ">" + '<html> <font color="green">' +testUser.substr(5) +":" +'</font></html>' +privateMsg.join(' ')+'<html> <font color="gray" size="0.5px" align="right">' + utcDate  +'</font></html>');
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