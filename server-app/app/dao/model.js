(function () {
    'use strict';
    // Export the module
    module.exports = function (options) {
        var q = require('q');

        var Model = function () {};

        Model.prototype = {
            /**
             * Set a field
             * @param   {String} name  Field name
             * @param   {Object} value Field value
             * @returns {Model} this object (for chaining)
             */
            _set: function (name, value) {
                if (name) {
                    if ('undefined' === typeof this._data) {
                        this._data = {};
                    }
                    if ('string' === typeof name) {
                        this._data[(name === 'id' ? '_id' : name)] = value;
                    } else {
                        for (var key in name) {
                            this._data[(key === 'id' ? '_id' : key)] = name[key];
                        }
                    }
                }
                return this;
            },

            /**
             * Check if a field is defined
             * @param   {String} key Field name
             * @returns {boolean}
             */
            _has: function (key) {
                return ('undefined' !== typeof this._data[(key === 'id' ? '_id' : key)]);
            },

            /**
             * Get a field
             * @param   {String} name  Field name
             * @returns {Object} Field value
             */
            _get: function (name) {
                if ('undefined' !== typeof this._data) {
                    if (name) {
                        return this._data[(name === 'id' ? '_id' : name)];
                    } else {
                        return this._data;
                    }
                }
            },

            /**
             * Set the Query Object
             * @param {Query} Query Query Object
             */
            _setQuery: function (Query) {
                Model.prototype.Query = Query;
            },

            /**
             * Save the object
             * @returns {Promise}
             */
            _save: function () {
                var defered = q.defer();
                if (this.Query) {
                    (new this.Query()).save(this._data).then(
                        function (data) {
                            defered.resolve(data);
                        },
                        function (err) {
                            defered.reject(err);
                        }
                    );
                } else {
                    defered.reject('Unable to reach database');
                }
                return defered.promise;
            },

            /**
             * remove this element
             * @returns {Promise}
             */
            _remove: function () {
                var defered = q.defer();
                if (this.Query) {
                    if (this.has('id')) {
                        (new this.Query()).remove({
                            _id: this.get('id')
                        }).then(
                            function (data) {
                                defered.resolve(data);
                            },
                            function (err) {
                                defered.reject(err);
                            }
                        );
                    } else {
                        defered.reject('Object has no id');
                    }
                } else {
                    defered.reject('Unable to reach database');
                }
                return defered.promise;
            },

            /**
             * Set a field
             * @param   {String} name  Field name
             * @param   {Object} value Field value
             * @returns {Model} this object (for chaining)
             */
            set: function (name, value) {
                return this._set(name, value);
            },

            /**
             * Get a field
             * @param   {String} name  Field name
             * @returns {Object} Field value
             */
            get: function (name) {
                return this._get(name);
            },

            /**
             * Save the object
             * @returns {Promise}
             */
            save: function () {
                return this._save();
            },

            /**
             * remove this element
             * @returns {Promise}
             */
            remove: function () {
                return this._remove();
            },

            /**
             * Check if a field is defined
             * @param   {String} key Field name
             * @returns {boolean}
             */
            has: function (key) {
                return this._has(key);
            },

            database: options.database

        };

        return Model;
    };

})();