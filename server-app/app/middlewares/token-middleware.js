(function () {
    'use strict';

    var TokenMiddleware = function (options) {
        this.options = require('extend')({
            secret: 'secret'
        }, options);
        this.oauth = this.options.services.oAuth;
    };

    TokenMiddleware.prototype = {

        /**
         * Express Middleware to manage LOG
         * In each middleware req.log(string) function is available
         * @param {Object}   req  request
         * @param {Object}   res  resource
         * @param {function} next next treatment
         */
        middleware: function () {
            var _self = this;
            var jwt = require('jsonwebtoken');
            var q = require('q');
            return function (req, res, next) {
                var promises = [];
                if ('undefined' !== typeof req.headers['refresh-token']) {
                    var refreshDefered = q.defer();
                    promises.push(refreshDefered.promise);
                    _self.oauth.decodeRefreshToken(req.headers['refresh-token']).then(function (token) {
                        refreshDefered.resolve({
                                'refresh-token': token
                            });
                    }, function (err) {
                        refreshDefered.resolve({
                                'refresh-token': {
                                    err: err
                                }
                            });
                    });
                }
                if ('undefined' !== typeof req.headers['access-token']) {
                    var accessDefered = q.defer();
                    promises.push(accessDefered.promise);
                    _self.oauth.decodeAccessToken(req.headers['access-token']).then(function (token) {
                        accessDefered.resolve({
                                'access-token': token
                            });
                    }, function (err) {
                        accessDefered.resolve({
                                'access-token': {
                                    err: err
                                }
                            });
                    });
                }
                q.all(promises).then(function (data) {
                    // copy the tokens in the resource
                    for (var i in data) {
                        for (var key in data[i]) {
                            res[key] = data[i][key];
                        }
                    }
                    next();
                }, function (err) {
                    next();
                });
            };
        }
    };

    module.exports = TokenMiddleware;
})();