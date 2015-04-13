(function () {
    'use strict';

    var UserTable = function (options) {
        require('extend')(this, {
            db: null
        }, options);
    };

    UserTable.prototype = {
        fieldMask: function(data) {
            var mask = ['name', 'email', 'password', 'login', 'role', 'objectId'];
            var result = {};
            for (var key in data) {
                if (mask.indexOf(key)>-1) {
                    result[key] = data[key];
                }
            }
        },
        encodePassword: function(data) {
            if ('undefined' !== typeof data.password) {
                data.password = require('crypto').createHash('sha256').update(data.password).digest('hex');
            }
        },
        getOne: function (filter) {
            
        },
        update: function (data) {},
        insert: function (data) {
            var defered = q.defer();
            this.db.get('users').insert(this.fieldMask(data), function (err, user) {
                if (err) {
                    defered.reject(err);
                } else {
                    delete user.password;
                    defered.resolve(user);
                }
            });
            return defered.promise;
        }
    };

    module.exports = function (options) {
        return new UserTable(options);
    };
})();