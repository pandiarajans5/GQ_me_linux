var server = require('net').createServer();		//Crearte Server
server.listen('4568');		//Make the server to listen in the port 4568
var nou = 0;	//Number of users
var users = new Map();
var clientname,uname;
var nickName;
var name = new Array();
var userslist;

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
			nickName = "/nick"+chunk;
				if(!users.has(nickName))
				{
					
			    	users.set(nickName,this);		//Map nickName and socket
			       	this.nickname = nickName;	//Assign new property to the socket(nickname)
			       	flag = users.has(nickName);	//Check whether the registration successfull	
			       	this.write("Sucessfully added to chat room\n");	//Welcome the client
					name.push(nickName);
				}
				else 
				{
					socket.write("Nick Name already exsit. Choose different Name");			
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