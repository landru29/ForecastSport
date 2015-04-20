(function () {
    'use strict';

    // Export the module
    module.exports = function (options) {
        var q = require('q');

        var Query = function () {};

        Query.prototype = {
            /**
             * Get one user
             * @param   {Object} filter Filter
             * @returns {Promise}
             */
            _getOne: function (filter) {
                var defered = q.defer();
                var _self = this;
                this.table.findOne(filter, this.options, function (err, element) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        if (element) {
                            var elt = _self.Model ? new _self.Model(element) : element;
                            defered.resolve(elt);
                        } else {
                            defered.reject('No element found');
                        }
                    }
                });
                return defered.promise;
            },

            _setModel: function (Model) {
                Query.prototype.Model = Model;
            },

            /**
             * Get all objects matching with the filter
             * @param   {Object} filter Filter
             * @returns {boolean}
             */
            _getAll: function (filter) {
                var defered = q.defer();
                var _self = this;
                this.table.find(filter, this.options, function (err, elements) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        if (elements) {
                            var result = [];
                            for (var i in elements) {
                                var elt = _self.Model ? new _self.Model(elements[i]) : elements[i];
                                result.push(elt);
                            }
                            if (result.length) {
                                defered.resolve(result);
                            } else {
                                defered.reject('No element found');
                            }
                        } else {
                            defered.reject('No element found');
                        }
                    }
                });
                return defered.promise;
            },

            /**
             * Insert a new object
             * @param   {Object} data User data
             * @returns {Promise}
             */
            _insert: function (data) {
                var defered = q.defer();
                var _self = this;
                _self.addIndexes().then(
                    function () {
                        _self.table.insert(data, function (err, insertedElement) {
                            if (err) {
                                defered.reject(err);
                            } else {
                                var elt = _self.Model ? new _self.Model(insertedElement) : insertedElement;
                                defered.resolve(elt);
                            }
                        });
                    },
                    function (err) {
                        defered.reject(err);
                    }
                );

                return defered.promise;
            },

            /**
             * Update an object ; _id must be specified
             * @param   {Object}   data new user data
             * @returns {Promise}
             */
            _update: function (data) {
                var _self = this;
                var defered = q.defer();

                _self.addIndexes().then(
                    function () {
                        var myData = JSON.parse(JSON.stringify(data));
                        delete myData._id;
                        _self.table.update({
                            _id: data._id
                        }, {
                            $set: myData
                        }, function (err, user) {
                            if (err) {
                                defered.reject(err);
                            } else {
                                _self.getOne({
                                    _id: data._id
                                }).then(
                                    function (updatedElement) {
                                        defered.resolve(updatedElement);
                                    },
                                    function (err) {
                                        defered.reject(err);
                                    }
                                );
                            }
                        });
                    },
                    function (err) {
                        defered.reject(err);
                    }
                );

                return defered.promise;
            },

            /**
             * Remove elements
             * @param   {object} filter Element filter
             * @returns {Promise}
             */
            _remove: function (filter) {
                var defered = q.defer();
                this.table.remove(filter, function (err, data) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        defered.resolve(data);
                    }
                });
                return defered.promise;
            },

            /**
             * Save object
             * @returns {Promise}
             */
            save: function (element) {
                var _self = this;
                var defered = q.defer();
                if (!element._id) {
                    this._insert(element).then(
                        function (data) {
                            defered.resolve(data);
                        },
                        function (err) {
                            defered.reject(err);
                        }
                    );
                } else {
                    this._update(element).then(
                        function (data) {
                            defered.resolve(data);
                        },
                        function (err) {
                            defered.reject(err);
                        }
                    );
                }
                return defered.promise;
            },

            remove: function (filter) {
                return this._remove(filter);
            },

            /**
             * Get one user
             * @param   {Object} filter Filter
             * @returns {Promise}
             */
            getOne: function (filter) {
                return this._getOne(filter);
            },

            /**
             * Get all objects matching with the filter
             * @param   {Object} filter Filter
             * @returns {boolean}
             */
            getAll: function (filter) {
                return this._getAll(filter);
            },

            /**
             * Get a user by ID
             * @param   {String} id User Id
             * @returns {Promise}
             */
            getById: function (id) {
                return this.getOne({
                    _id: id
                });
            },

            database: options.database,
            table: options.database.get(options.name),
            options: {}

        };

        return Query;
    };
})();