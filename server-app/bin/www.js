#!/usr/bin/env node

var cluster = require('cluster');
var config = require('../config.json');

var log = function(message, level) {
    console.log((level ? level[0].toUpperCase() + ' ':'  ') + (new Date()).toISOString() + '[' + process.pid + ']: > ' + message);
}

if (cluster.isMaster) {
	var nbProcesses = parseInt(config.process['nb-forks'], 10);

	console.log('######################################');
	console.log('############## API REST ##############');
	console.log('######################################' + "\n");
	console.log('Creating ' + nbProcesses + ' processes');

	// Launch server processes
	var serverProcesses = [];
    
	for (var i = 0; i < nbProcesses; i++) {
		serverProcesses.push(cluster.fork({
			task: 'server'
		}).process.pid);
	}

	// Launch deamon process
	/*var deamonProcess = cluster.fork({
		task: 'deamon'
	}).process.pid;*/

	/* relaunch process if dying */
	cluster.on('exit', function(worker) {
        log('Worker ' + worker.process.pid + ' died :(');
		// check if this is a server process
		var index = serverProcesses.indexOf(worker.process.pid);
		if (index > -1) {
			serverProcesses[index] = cluster.fork({
				task: 'server'
			});
		}
		// check if this a th deamon server
		if (deamonProcess === worker.process.pid) {
			deamonProcess = cluster.fork({
				task: 'deamon'
			}).process.pid;
		}
	});

} else {
	switch (process.env.task) {
		case 'server':
			var app = require('../app');
			//app.set('port', config.process['binding-port']);

			/* Binding */
			var server = app.listen(config.process['binding-port'], function() {
				log('Express server listening on port ' + server.address().port);
			});
			break;
		case 'deamon':
			var deamon = require('../deamon');
			break;
		default:
			break;
	}
}