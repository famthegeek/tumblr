console.log("> FastTest");
console.log("> I allow you to quickly develop the server");
console.log("> My output has a '>' infront of it");

var args = process.argv.splice(2),
	fs = require("fs"),
	serverProcess = undefined,
	child_process = require('child_process');

args.unshift("server.js");

function send_change () {
	console.log("> Server Reboot!");
	if(serverProcess != undefined){
		serverProcess.kill('SIGQUIT');
	}
	setTimeout(function () {
		serverProcess = child_process.spawn("node", args);

		serverProcess.stdout.on('data', function (data) {
			process.stdout.write(data);
		});
		serverProcess.stderr.on('data', function (data) {
			process.stdout.write(data);
		});

		serverProcess.on("exit", function(){
			console.log("> Server died");
		});
	}, 500);
}

var watchT = undefined;
function watch(){
	fs.watch("server.js", function (event, filename) {
		if(event == "change"){
			if(watchT != undefined) clearTimeout(watchT);
			watchT = setTimeout(send_change, 400);
		}
	});
}
watch();
send_change();

console.log("> ok");