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

	
	// // Welcome the user and Get NickName
	// socket.write("Hi!Guest Welcome to Chat room\n");
	// nou = users.size;
	// socket.write("Number of users in caht room "+nou+"\n");	//List the number of users in chat room
	// socket.write("Users in chat room are\n")
	// socket.write("************************************\n");
	// userslist = users.keys();
	// console.log(userslist);
	// //List the users name in Chat room
	// for (var i = 0; i<nou; i++){
	// 		//name = userslist.next().value;
	// 		socket.write(userslist.next().value +"\t");
	// }
	// socket.write("\n************************************\n");
	// socket.write("\nKindly Enter a Nick Name to start chat in the format '/nick <yourname>'\n");
	var done = 0;
var flag = 'false';



	socket.on('data',function(chunk){
	
	
	if(flag == 'false')
	{
	var nickName;
	
	//var reg = 'false';
	// Check the NickName format
		// var pattern = new RegExp(/^[\/]{1}nick [a-zA-Z]+/);
		// var result = pattern.test(chunk);
		//If user not registered, Register
		//Also map the nickname with socket.
		//if(reg == 'false'){
			//if (result){
			    // nickName = chunk.substring(6);
			    // nickName = nickName.replace(/\n$/,'');	//Remove the newline character in the nickName
			console.log(chunk);
			     nickName = chunk;
				if(!users.has(nickName)){
			    	users.set(nickName,this);		//Map nickName and socket
			       	this.nickname = nickName;	//Assign new property to the socket(nickname)
			       	flag = users.has(nickName);	//Check whether the registration successfull	
			       	this.write("Sucessfully added to chat room\n");	//Welcome the client
					
					//users.forEach(userAdded);	//Broadcast when a new user is added
					//reg = users.has(nickName);	//Check whether the registration successfull
					//Broadcast new user name
					done = 1;
					
					
			     	function userAdded(value,key)
					{
					 	if(value.nickname !== nickName)
					 	{
					 		value.write("\n"+nickName +" is added to chat room\n");
					 	}
					}
				// this.removeListener('data',nickRegister);
				
				// this.on('data',sendMsg);
				}
				else {
					socket.write("Nick Name already exsit. Choose different Name");			
				}
	}
	else
	{
		if(chunk == "Redirected")
		{
			userslist = users.keys();
					nou = users.size;
					var user=0;
					//List the users name in Chat room
					 for (var i = 0; i<nou; i++){
					// 		//name = userslist.next().value;
							socket.write(userslist.next().value +"\t");

							user=1;

					 }
					 if(user==1){
					 			// console.log("hi");
								socket.write("ok");
							}
					
					// console.log(chunk);
					//this.write(this.nickname +":"+chunk);
		}
		else
		{
			var username = this.nickname;
					users.forEach(msg);
						function msg(value,key){
								if(value.nickname !== nickName){
									var uname='<html> <font color="blue">' + username  +":" +'</font></html>';
									value.write(uname+chunk);
								}
							}
		}			
	}
			// }
			// else{
			// 	socket.write("Enter nick name in correct format");
			// }
		// }
		// else
		// {
		// 	socket.write("Register First");
		// }
});


	
});


// function sendMsg(chunk)
// {
// 	var checkMsg = new RegExp(/^@/);
// }

// function selectOption(chunk)
// {
// 	console.log(chunk);
// 	var s=parseInt(chunk);
// 	switch(s)
// 	{
// 		case 1:
// 			this.removeListener('data',selectOption);
// 			this.write("Choose a user to chat\n");
// 			this.on('data',getUser);
// 		break;
// 	}
// }

// function getUser(chunk)
// {
// 	uname = chunk;
// 	this.removeListener('data',getUser);
// 	this.write("Enter ur msg\n");
// 	this.on('data',sendMsg);
// }

