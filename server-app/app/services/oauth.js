(function () {
    'use strict';

    var jwt = require('jsonwebtoken');

    var OAuth = function (options) {
        this.options = require('extend')({
            secretRefresh: 'secret',
            secretAccess: 'secret',
            expiresInMinutes: '10',
            userTable: null
        }, options);
    };

    OAuth.prototype = {
        requestTokens: function (login, password) {
            var _self = this;
            var defered = q.defer();
            if ((!login) || (!password)) {
                defered.reject('Authentication failed');
            } else {
                _self.options.userTable.getOne({
                    login: login,
                    password: password
                }).then(
                    function (user) {
                        _self.getRefreshToken(user).then(
                            function (refreshToken) {
                                _self.getAccessToken(refreshToken).then(
                                    function (accessToken) {
                                        defered.resolve({
                                            accessToken: accessToken,
                                            refreshToken: refreshToken
                                        });
                                    },
                                    function (err) {
                                        defered.reject(err);
                                    }
                                );
                            },
                            function (err) {
                                defered.reject(err);
                            }
                        );
                    },
                    function (err) {
                        defered.reject('Authentication failed');
                    }
                );
            }
            return defered.promise;
        },

        decodeToken: function (token, secret) {
            var defered = q.defer();
            jwt.verify(token, secret, function (err, decoded) {
                if (err) {
                    defered.reject(err);
                } else {
                    defered.resolve(decoded);
                }
            });
            return defered.promise;
        },

        decodeRefreshToken: function (token) {
            return this.decodeToken(token, this.options.secretRefresh);
        },

        decodeAccessToken: function (token) {
            return this.decodeToken(token, this.options.secretAccess);
        },

        getRefreshToken: function (user) {
            var defered = q.defer();
            defered.resolve(jwt.sign(user._id,
                this.options.secretRefresh));
            return defered.promise;
        },

        getAccessToken: function (refreshToken) {
            var _self = this;
            var defered = q.defer();
            this.decodeRefreshToken(refreshToken).then(
                function (userId) {
                    console.log(userId);
                    _self.getAccessTokenFromId(userId).then(
                        function(data){
                            defered.resolve(data);
                        }, 
                        function(err){
                            defered.reject(err);
                        }
                    );
                },
                function (err) {
                    defered.reject(err);
                }
            );
            return defered.promise;
        },

        getAccessTokenFromId: function (userId) {
            var _self = this;
            var defered = q.defer();
            _self.options.userTable.getById(userId).then(
                function (user) {
                    defered.resolve(jwt.sign(
                        JSON.parse(JSON.stringify(user)),
                        _self.options.secretAccess, {
                            expiresInMinutes: _self.options.expiresInMinutes
                        }));
                },
                function (err) {
                    defered.reject('User not found');
                }
            );
            return defered.promise;
        }
    };

    module.exports = OAuth;
})();