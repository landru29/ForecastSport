(function () {
    'use strict';

    var Database = function (options) {
        this.options = require('extend')({
            host: 'localhost',
            port: '27017',
            database: 'test'
        }, options);
    };

    Database.prototype = {
        /**
         * Instanciate a Monk object on the database
         * @param  {object} configuration database configuration
         * @return {object} Monk object pointing on the database
         */
        getDatabase: function () {
            var mongoose = require('mongoose');
            mongoose.connect('mongodb://' + this.options.host + ':' + this.options.port + '/' + this.options.database);
            return mongoose.connection.db;
            //return require('monk')(this.options.host + ':' + this.options.port + '/' + this.options.database);
        }
    };

    module.exports = function (options) {
        return new Database(options);
    };
})();