(function () {
    'use strict';

    // Export the module
    module.exports = function (options) {
        var crypto = require('crypto');
        var Model = require('./model.js')(options);
        var q = require('q');

        var ThisModel = function (data) {
            for (var key in data) {
                this.set(key, data[key]);
            }
            this.table = this.database.get('users');
        };

        ThisModel.prototype = Object.create(Model.prototype);

        ThisModel.prototype.set = function (name, value) {
            this._set(name, (name === 'password' ? crypto.createHash('sha256').update(value).digest('hex') : value));
        };

        ThisModel.prototype.get = function (name) {
            if (name !== 'password') {
                return this._get(name);
            }
        };
        
        ThisModel.prototype.save = function() {
            var defered = q.defer();
            if ((this.has('login')) && (this.has('password')) && (this.has('email'))) {
                this._save().then(
                    function(data){
                        defered.resolve(data);
                    }, 
                    function(err){
                        defered.reject(err);
                    }
                );
            } else {
                defered.reject('Missing mendatory field : email, password, login');
            }
            
            return defered.promise;
        };

        return ThisModel;
    };
})();