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
                if (req.headers['refresh-token']) {
                    res.log('refresh-token found');
                    var refreshDefered = q.defer();
                    promises.push(refreshDefered.promise);
                    _self.oauth.decodeRefreshToken(req.headers['refresh-token']).then(function (token) {
                        refreshDefered.resolve({
                                'refresh-token': token
                            });
                    }, function (err) {
                        refreshDefered.reject({
                            origin: 'refresh-token',
                            message: err.name
                        });
                    });
                }
                if (req.headers['access-token']) {
                    res.log('access-token found');
                    var accessDefered = q.defer();
                    promises.push(accessDefered.promise);
                    _self.oauth.decodeAccessToken(req.headers['access-token']).then(function (token) {
                        accessDefered.resolve({
                                'access-token': token
                            });
                    }, function (err) {
                        accessDefered.reject({
                            origin: 'access-token',
                            message: err.name
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
                    res.log(err.name + ' : ' + err.message);
                    res.status(403).send(err);
                });
            };
        }
    };

    module.exports = TokenMiddleware;
})();