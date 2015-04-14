(function () {
    'use strict';

    var CorsMiddleware = function (options) {
        this.options = require('extend')({
            domains:[],
            allowedHeaderFields: ['origin', 'content-type', 'accept', 'Authorization'],
            allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
        }, options);
    };

    CorsMiddleware.prototype = {
        /**
         * Allow cross-domain
         * @param  {object}   req        request
         * @param  {object}   res        resource
         * @param  {array}    domainList list of domains
         */
        allowCrossDomain: function (req, res, domainList) {
            if (req.headers.origin) {
                for (var i in domainList) {
                    if (domainList[i].toLowerCase() === req.headers.origin.toLowerCase()) {
                        res.header('Access-Control-Allow-Origin', req.headers.origin);
                    }
                }
            }
        },
        
        /**
         * Get the method of the request
         * @param  {object} req request object
         * @return {string} method
         */
        getHttpMethod: function (req) {
            if (req.query.method) {
                return req.query.method.toUpperCase();
            } else {
                return req.method.toUpperCase();
            }
        },

        /**
         * Express Middleware to manage LOG
         * In each middleware req.log(string) function is available
         * @param {Object}   req  request
         * @param {Object}   res  resource
         * @param {function} next next treatment
         */
        middleware: function() {
            var _self = this;
            return function (req, res, next) {
                _self.allowCrossDomain(req, res, _self.options.domains);
                switch (_self.getHttpMethod(req)) {
                case 'OPTIONS':
                    res.header('Access-Control-Allow-Headers', _self.options.allowedHeaderFields.join(', '));
                    res.header('Access-Control-Allow-Methods', _self.options.allowedMethods.join(', '));
                    res.log('Cors: ' + this.options.allowedHeaderFields.join(', '));
                    break;
                default:
                }
                next();
            };
        }
    };


    module.exports = function (config) {
        return new CorsMiddleware(config);
    };
})();