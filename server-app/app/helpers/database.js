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
            return require('monk')(this.options.host + ':' + this.options.port + '/' + this.options.database);
        }
    };

    module.exports = Database;
})();
