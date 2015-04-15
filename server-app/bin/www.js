#!/usr/bin/env node


GLOBAL.q = require('q');

(function () {

    var cluster = require('cluster');
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
            var app = (new Server()).app;

            /* Binding */
            var server = app.listen(config.process['binding-port'], function () {
                log('Express server listening on port ' + server.address().port);
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
