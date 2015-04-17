(function () {
    'use strict';

    var UserTable = function (options) {
        require('extend')(this, {
            db: null
        }, options);
        this.table = this.db.get('users');
    };

    UserTable.prototype = {
        /**
         * Add unqique indexes on the collection
         * @returns {Promise}
         */
        addIndexes: function () {
            return q.all([this.table.index('login', {
                unique: true
            })]);
        },
        
        /**
         * Apply a mask on the fields of an object
         * @param   {Object} data Object to mask
         * @returns {Object} filtered object
         */
        fieldMask: function (data) {
            var mask = ['name', 'email', 'password', 'login', 'role', 'objectId'];
            var result = {};
            for (var key in data) {
                if (mask.indexOf(key) > -1) {
                    result[key] = data[key];
                }
            }
            return result;
        },
        
        /**
         * Check for mendatory data
         * @param   {Object}   data User data
         * @returns {boolean}
         */
        checkMendatory: function (data) {
            return ((data.login) && (data.password) && (data.email));
        },
        
        /**
         * Encode the password
         * @param   {Object}   data User data
         * @returns {Object} new user data with encoded password
         */
        encodePassword: function (data) {
            var user = JSON.parse(JSON.stringify(data));
            if ('undefined' !== typeof data.password) {
                user.password = require('crypto').createHash('sha256').update(data.password).digest('hex');
            }
            return user;
        },
        
        /**
         * Get one user
         * @param   {Object} filter Filter
         * @returns {Promise}
         */
        getOne: function (filter) {
            var defered = q.defer();
            this.table.findOne(this.encodePassword(filter), function (err, user) {
                if (err) {
                    defered.reject(err);
                } else {
                    if (user) {
                        delete user.password;
                        defered.resolve(user);
                    } else {
                        defered.reject('No user found');
                    }
                }
            });
            return defered.promise;
        },
        
        /**
         * Get all users matching with the filter
         * @param   {Object} filter Filter
         * @returns {boolean}
         */
        getAll: function (filter) {
            var defered = q.defer();
            this.table.find(this.encodePassword(filter), function (err, users) {
                if (err) {
                    defered.reject(err);
                } else {
                    if (users) {
                        for (var i in users) {
                            delete users[i].password;
                        }
                        if (users.length) {
                            defered.resolve(users);
                        } else {
                            defered.reject('No user found');
                        }
                    } else {
                        defered.reject('No user found');
                    }
                }
            });
            return defered.promise;
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
        
        /**
         * Update a user; login or _id must be specified
         * @param   {Object}   data new user data
         * @returns {Promise}
         */
        update: function (data) {
            var _self = this;
            var defered = q.defer();
            if ((!data._id) && (!data.login)) {
                defered.reject('Missing ID or login');
            } else {
                var filter = {};
                if (data.login) {
                    filter.login = data.login;
                }
                if (data._id) {
                    filter._id = data._id;
                    delete data._id;
                }
                _self.addIndexes().then(
                    function () {
                        _self.table.update(filter, {
                            $set: _self.encodePassword(data)
                        }, function (err, user) {
                            if (err) {
                                defered.reject(err);
                            } else {
                                _self.getOne(filter).then(
                                    function (updatedUser) {
                                        defered.resolve(updatedUser);
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
            }
            return defered.promise;
        },
        
        /**
         * Insert a new user
         * @param   {Object} data User data
         * @returns {Promise}
         */
        insert: function (data) {
            var defered = q.defer();
            var _self = this;
            if (!this.checkMendatory(data)) {
                defered.reject('Missing mendatory fields');
            } else {
                _self.addIndexes().then(
                    function () {
                        _self.table.insert(_self.fieldMask(_self.encodePassword(data)), function (err, user) {
                            if (err) {
                                defered.reject(err);
                            } else {
                                delete user.password;
                                defered.resolve(user);
                            }
                        });
                    },
                    function (err) {
                        defered.reject(err);
                    }
                );

            }
            return defered.promise;
        },
        
        /**
         * Remove users
         * @param   {Object} filter Filter
         * @returns {Promise}
         */
        remove: function (filter) {
            var defered = q.defer();
            var _self = this;
            _self.table.remove(filter, function (err, data) {
                if (err) {
                    defered.reject(err);
                } else {
                    defered.resolve(data);
                }
            });
            return defered.promise;
        }
    };

    module.exports = UserTable;
})();