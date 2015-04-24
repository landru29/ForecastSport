(function () {
    'use strict';

    var Server = function () {
        var express = require('express');

        // Load configuration
        this.config = require('./config.json');
        require('extend')(this.config, require('./authentification.json'));

        // Load resources data
        var resources = require('./resources.json');

        // Initialize database
        this.database = new(require('./helpers/database.js'))(this.config.db);

        // log stream
        var LoggerService = require('./services/logger.js');
        this.logger = new LoggerService({
            file: __dirname + '/../' + this.config.log.file
        });
        this.logger.openStream();
        this.logger.log('PID ' + process.pid + ' started');

        // loading db queries
        this.dao = new(require('./helpers/dao.js'))({
            query: {
                path: __dirname + '/dao',
                pattern: /-query\.js$/
            },
            model: {
                path: __dirname + '/dao',
                pattern: /-model\.js$/
            },
            database: this.database.getDatabase(),
            logger: this.logger
        });

        // load services
        this.services = this.loadServices();

        // Initialize the API
        this.logger.log('** Initialize Express **');
        this.app = express();

        // Load middlewares
        this.app.use(this.getMiddleware('logger', {
            logger: this.logger,
            services: this.services
        }));
        this.app.use(require('cookie-parser')(this.config.cookies.secret));
        this.app.use(require('body-parser').json());
        this.app.use(require('express-session')({
            secret: 'keyboard cat',
            resave: false,
            saveUninitialized: true
        }));
        this.app.use(this.getMiddleware('cors', {
            domains: this.config.cors,
            services: this.services
        }));
        this.app.use(this.getMiddleware('token', {
            services: this.services
        }));
        this.app.use(this.getMiddleware('filesystem', {
            basePath: __dirname,
            public: this.config.public,
            services: this.services
        }));
        this.app.use(this.getMiddleware('acl', {
            resources: resources,
            services: this.services
        }));

        // Define the routes
        for (var route in resources) {
            this.logger.log('Adding route ' + route);
            this.app.use('/' + route, require('./' + resources[route].controller)(express.Router(), {
                services: this.services,
                dao: this.dao,
                config: this.config
            }));
        }

        // Express application is ready
        this.logger.log('** Express is ready **');
        this.logger.log('Log format: level date [process PID] (request UUID) message');
    };

    Server.prototype = {
        /**
         * Load all the services
         * @returns {Object} [[Description]]
         */
        loadServices: function () {

            var services = {};

            services.oAuth = new(require('./services/oauth.js'))({
                secretRefresh: this.config.OAuth.secretRefresh,
                secretAccess: this.config.OAuth.secretAccess,
                expiresInMinutes: this.config.OAuth.expiresInMinutes,
                dao: this.dao,
                services: services
            });
            
            services.facebook = new(require('./services/facebook.js'))(this.config.facebook);

            services.passwordManager = new(require('./services/password-manager.js'))({
                resetPasswordSecret: this.config.OAuth.resetPasswordSecret,
                email: this.config.email,
                dao: this.dao,
                services: services
            });

            services.logger = this.logger;

            return services;
        },

        /**
         * Load a custom middleware for express
         * @param   {String}         name filename of the middleware
         * @param   {Object | array} args single argument or array of arguments
         * @returns {function}            middleware to implement into Express
         */
        getMiddleware: function (name, options) {
            this.logger.log('Loading middleware ' + name);
            var MiddleWareObj = require(__dirname + '/middlewares/' + name + '-middleware');
            return (new MiddleWareObj(options)).middleware();
        }
    };

    // Export the module
    module.exports = Server;
})();