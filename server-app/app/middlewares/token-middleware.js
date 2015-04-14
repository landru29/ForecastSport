(function () {
    'use strict';

    var TokenMiddleware = function (options) {
        this.options = require('extend')({
            secret: 'secret'
        }, options);
    };

    TokenMiddleware.prototype = {

        /**
         * Express Middleware to manage LOG
         * In each middleware req.log(string) function is available
         * @param {Object}   req  request
         * @param {Object}   res  resource
         * @param {function} next next treatment
         */
        middleware: function() {
            var _self = this;
            var jwt = require('jsonwebtoken');
            var q = require('q');
            return function (req, res, next) {
                var promises = [];
                if ('undefined' !== typeof req.headers['refresh-token']) {
                    var refreshDefered = q.defer();
                    promises.push(refreshDefered.promise);
                    jwt.verify(req.headers['refresh-token'], _self.options.secret, function (err, decoded) {
                        if (err) {
                            refreshDefered.resolve({
                                'refresh-token': {
                                    err: err
                                }
                            });
                        } else {
                            refreshDefered.resolve({
                                'refresh-token': decoded
                            });
                        }
                    });

                }
                if ('undefined' !== typeof req.headers['access-token']) {
                    var accessDefered = q.defer();
                    promises.push(accessDefered.promise);
                    jwt.verify(req.headers['access-token'], _self.options.secret, function (err, decoded) {
                        if (err) {
                            accessDefered.resolve({
                                'access-token': {
                                    err: err
                                }
                            });
                        } else {
                            accessDefered.resolve({
                                'access-token': decoded
                            });
                        }
                        console.log('End of treatment access-token');
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