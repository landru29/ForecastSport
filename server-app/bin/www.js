#!/usr/bin/env node


GLOBAL.q = require('q');

(function () {

    var cluster = require('cluster');
    var http = require('http');
    var https = require('https');
    var config = require('../app/config.json');
    var Server = require('../app/app');

    var log = function (message, level) {
        console.log((level ? level[0].toUpperCase() + ' ' : '  ') + (new Date()).toISOString() + '[' + process.pid + ']: > ' + message);
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
        cluster.on('exit', function (worker) {
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
            var application = new Server();
            
            /*var fs = require('fs');
            var credentials = {
                key: fs.readFileSync('sslcert/server.key', 'utf8'),
                cert: fs.readFileSync('sslcert/server.crt', 'utf8')
            };*/

            /* Binding */
            var httpServer = http.createServer(application.app);
            //var httpsServer = https.createServer(credentials, app);
            var server = httpServer.listen(config.process['binding-port'], function () {
                application.logger.log('Express server listening on port ' + server.address().port);
            });
            break;
        case 'deamon':
            var deamon = require('../app/deamon');
            break;
        default:
            break;
        }
    }
})();