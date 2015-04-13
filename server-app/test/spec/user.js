(function () {
    'use strict'

    var UserTest = function (options) {
        this.db = options.db;
        this.userTable = require('../../services/user-table.js')({
            db: this.db
        });
    }

    UserTest.prototype = {
        test0: function () {
            var user = {
                name: 'mickey',
                password: 'coucou',
                email: 'gog@gmail.com',
                role: ['admin']
            };
            this.userTable.encodePassword(user);
            return this.userTable.insert(user);
        }/*,
        test1: function () {
            var user = {
                name: 'mickey',
                password: 'coucou',
                email: 'gog@gmail.com',
                role: ['admin']
            };
            this.userTable.encodePassword(user);
            return this.userTable.insert(user);
        }*/

    }

    module.exports = function (options) {
        return new UserTest(options);
    };
})();