var net = require('net');

var client = net.connect(4568,'localhost');		//Connect the client to server listening @port 4568

var pattern = new RegExp(/^[\/]{1}nick [a-zA-Z]+/);		//RegExp for nickname validation



client.setEncoding('utf8');

client.once('data',welcomeClient);

//Wrtie the welcome message from server to the client

function welcomeClient(chunk)
{
	process.stdout.write(chunk);
	client.on('data',serverSideValidationCheck);
}

//Serverside nickname validation

function serverSideValidationCheck(chunk)
{
	if(chunk === "Sucessfully added to chat room\n")
	{
		
		client.removeListener('data', serverSideValidationCheck);
		process.stdin.removeListener('data',registerNickName);
		client.pipe(process.stdout);
		process.stdin.pipe(client);
	}
	process.stdout.write(chunk);
}

process.stdin.on('data',registerNickName);

function registerNickName(chunk)
{
	var result = pattern.test(chunk);
	if(result)
	{
		client.write(chunk);
	}
	else
	{
		console.log("Invalid NickName, Enter in correct format");
	}	
}