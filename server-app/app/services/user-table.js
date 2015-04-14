(function () {
    'use strict';

    var UserTable = function (options) {
        require('extend')(this, {
            db: null
        }, options);
        this.table = this.db.get('users');
        this.addIndexes();
    };

    UserTable.prototype = {
        addIndexes: function () {
            return q.all([this.table.index('login', {
                unique: true
            })]);
        },
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
        checkMendatory: function (data) {
            return ((data.login) && (data.password) && (data.email));
        },
        encodePassword: function (data) {
            var user = JSON.parse(JSON.stringify(data));
            if ('undefined' !== typeof data.password) {
                user.password = require('crypto').createHash('sha256').update(data.password).digest('hex');
            }
            return user;
        },
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
        update: function (data) {
            var _self = this;
            var defered = q.defer();
            if ((!data.ObjectId) && (!data.login)) {
                defered.reject('Missing ID or login');
            } else {
                var filter={};
                if (data.login) filter.login = data.login;
                if (data.ObjectId) filter.login = data.ObjectId;
                this.table.update(filter, {
                    $set: this.encodePassword(data)
                }, function(err, user) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        _self.getOne(filter).then(
                            function(data){
                                defered.resolve(data);
                            }, 
                            function(err){
                                defered.reject(err);
                            }
                        );
                    }
                });
            }
            return defered.promise;
        },
        insert: function (data) {
            var defered = q.defer();
            if (!this.checkMendatory(data)) {
                defered.reject('Missing mendatory fields');
            } else {
                this.table.insert(this.fieldMask(this.encodePassword(data)), function (err, user) {
                    if (err) {
                        defered.reject(err);
                    } else {
                        delete user.password;
                        defered.resolve(user);
                    }
                });
            }
            return defered.promise;
        }
    };

    module.exports = function (options) {
        return new UserTable(options);
    };
})();