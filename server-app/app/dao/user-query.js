(function () {
    'use strict';

    var q = require('q');

    // Export the module
    module.exports = function (options) {
        var Query = require('./query.js')(options);

        var crypto = require('crypto');

        var ThisQuery = function () {
            //Code here
        };

        ThisQuery.prototype = Object.create(Query.prototype);

        ThisQuery.prototype.addIndexes = function () {
            return q.all([this.table.index('login', {
                unique: true
            })]);
        };

        /**
         * Get one user
         * @param   {Object} filter Filter
         * @returns {Promise}
         */
        ThisQuery.prototype.getOne = function (filter) {
            var myFilter = JSON.parse(JSON.stringify(filter));
            if (myFilter.password) {
                myFilter.password = crypto.createHash('sha256').update(myFilter.password).digest('hex');
            }
            return this._getOne(myFilter);
        };

        /**
         * Get all objects matching with the filter
         * @param   {Object} filter Filter
         * @returns {boolean}
         */
        ThisQuery.prototype.getAll = function (filter) {
            var myFilter = JSON.parse(JSON.stringify(filter));
            if (myFilter.password) {
                myFilter.password = crypto.createHash('sha256').update(myFilter.password).digest('hex');
            }
            return this._getAll(myFilter);
        };
        
        ThisQuery.prototype.options.fields = {
            password:0
        };

        return ThisQuery;
    };
})();