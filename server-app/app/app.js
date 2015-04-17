(function () {
    'use strict';

    var Server = function () {
        var express = require('express');

        // Load configuration
        this.config = require('./config.json');
        require('extend')(this.config, require('./authentification.json'));

        // Load resources
        var resources = require('./resources.json');

        // load services
        this.services = this.loadServices();

        // log stream
        this.logger = this.services.logger;
        this.logger.openStream();
        this.logger.log('PID ' + process.pid + ' started');

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
            this.logger.log('> Adding route ' + route);
            this.app.use('/' + route, require('./' + resources[route].controller)(express.Router(), {
                services: this.services
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
            var UserTable = require('./dao/user-table.js');
            var OAuthService = require('./services/oauth.js');
            var LoggerService = require('./services/logger.js');
            var DatabaseService = require('./services/database.js');
            var UserService = require('./services/user.js');

            // open database
            var database = new DatabaseService(this.config.db);
            this.db = database.getDatabase();

            var userTable = new UserTable({
                db: this.db
            });

            var _self = this;

            var services = {};

            services.oAuth = new OAuthService({
                userTable: userTable,
                secretRefresh: _self.config.OAuth.secretRefresh,
                secretAccess: _self.config.OAuth.secretAccess,
                expiresInMinutes: _self.config.OAuth.expiresInMinutes,
                services: services
            });
            services.user = new UserService({
                collection: userTable,
                resetPasswordSecret: _self.config.OAuth.resetPasswordSecret,
                email: _self.config.email,
                services: services
            });
            services.logger = new LoggerService({
                file: __dirname + '/' + this.config.log.file
            });
            services.database = database;

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