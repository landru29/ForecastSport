(function () {
    'use strict';

    var server = function () {
        var express = require('express');

        /**
         * Load a custom middleware for express
         * @param   {String}         name filename of the middleware
         * @param   {Object | array} args single argument or array of arguments
         * @returns {function}            middleware to implement into Express
         */
        var getMiddleware = function (name, args) {
            logger.log('Loading middleware ' + name);
            var argument = (Object.prototype.toString.call(args) === '[object Array]' ? args : [args]);
            return require(__dirname + '/middlewares/' + name + '-middleware').apply(null, 'undefined' !== typeof args ? argument : []).middleware();
        };

        // Load configuration
        var conf = require('./config.json');
        require('extend')(conf, require('./authentification.json'));

        var db = require(__dirname + '/services/database')(conf.db).getDatabase();

        // log stream
        var logger = require(__dirname + '/services/logger')({
            file: __dirname + '/' + conf.log.file
        });
        logger.log('PID ' + process.pid + ' started');

        logger.log('** Initialize Express **');

        // Configure ACL
        //apiAcl = utils.aclConfiguration(conf, db);

        // load resources
        //var resourceDef = utils.loadResources(conf.resources, conf);
        //var loginCallbacks = require(__dirname + '/service/login')(db, conf);

        // Initialize the API
        var app = express();

        // pre treatement
        app.use(getMiddleware('logger', logger));

        app.use(require('cookie-parser')('Et prout! dans ton nez!'));
        /*app.use(require('cookie-session')({
        	secret: 'Justice avec les saucisses'
        }));*/
        app.use(require('body-parser').json());
        app.use(getMiddleware('cors', {
            domains: conf.cors
        }));
        app.use(getMiddleware('token'));
        app.use(getMiddleware('filesystem', {
            basePath: __dirname,
            public: conf.public
        }));
        app.use(getMiddleware('acl'));

        // Define the routes
        /*app.use('/', resourceDef.defaultRoute);
        for (var route in resourceDef.resources) {
        	accessLogStream.write(toLog('> Adding route ' + route) + "\n");
        	console.log(toLog('> Adding route ' + route));
        	app.use('/' + route, resourceDef.resources[route]);
        }*/

        logger.log('** Express is ready **');
        logger.log('Log format: level date [process PID] (request UUID) message');
        return app;
    };

    // Export the module
    module.exports = function (globals) {
        for (var i in globals) {
            GLOBAL[i] = globals[i];
        }
        return server();
    };
})();