var server = require('net').createServer();		//Crearte Server
server.listen('4568');		//Make the server to listen in the port 4568
var nou = 0;	//Number of users
var users = new Map();
server.on('connection',function(socket){
	console.log("conected");
	socket.setEncoding('utf8');
	// Welcome the user and Get NickName
	// socket.write("Hi!Guest Welcome to Chat room\n");
	// nou = users.size;
	// socket.write("Number of users in caht room "+nou+"\n");	//List the number of users in chat room
	// socket.write("Users in chat room are\n")
	// socket.write("************************************\n");
	// var userslist = users.keys();
	// //List the users name in Chat room
	// for (var i = 0; i<nou; i++){
	// 		socket.write(userslist.next().value+"\t");
	// }
	// socket.write("\n************************************\n");
	// socket.write("\nKindly Enter a Nick Name to start chat in the format /nick <yourname>'\n");
	var nickName;
	var reg = 'false';
	socket.on('data',function(chunk){
		// Check the NickName format
		var pattern = new RegExp(/^[\/]{1}nick [a-zA-Z]+/);
		var result = pattern.test(chunk);
		console.log(chunk);
		//If user not registered, Register
		//Also map the nickname with socket.
		if(reg == 'false'){
			//if (result){
			   // nickName = chunk.substring(6);
			   // nickName = nickName.replace(/\n$/,'');	//Remove the newline character in the nickName

			   nickName = chunk;
				if(!users.has(nickName)){
			    	users.set(nickName,socket);		//Map nickName and socket
			       	this.nickname = nickName;			//Assign new property to the socket(nickname)
			    	socket.write("Sucessfully added to chat room\n");	//Welcome the client
					users.forEach(userAdded);	//Broadcast when a new user is added
					reg = users.has(nickName);	//Check whether the registration successfull
					//Broadcast new user name
					console.log(reg);
			    	function userAdded(value,key)
					{
						if(value.nickname !== nickName)
						{
							value.write("\n"+nickName +" is added to chat room\n");
						}
					}	
				}
				else {
					socket.write("Nick Name already exsit. Choose different Name");			
				}
			//}
			// else{
			// 	socket.write("Enter nick name in correct format");
			// }
		}
		//If registration successful, boradcast the Message from the client to all
		// if(reg) {
		// 	console.log(chunk);
		// 	users.forEach(msg);
		// 		function msg(value,key){
		// 			if(value.nickname !== nickName){
		// 				value.write(nickName+":"+chunk);
		// 			}
		// 		}
		// }
	});	
	//When connection close, remove the user from the list and intimate to others in the room
	socket.on('close',function(){
		users.delete(nickName);
		users.forEach(exit);
		function exit(value,key){
			value.write(nickName +" went offline");
		}
	});
});
server.on('listening',function(){
	console.log("Server listening on port 4568");
});