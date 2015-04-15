(function () {
    'use strict';

    var CorsMiddleware = function (options) {
        this.options = require('extend')({
            domains:[],
            allowedHeaderFields: ['origin', 'content-type', 'accept', 'Authorization', 'refresh-token', 'access-token'],
            allowedMethods: ['GET', 'POST', 'PUT', 'DELETE']
        }, options);
        
        this.HttpInfo = require('../helpers/http-info.js');
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
         * Express Middleware to manage LOG
         * In each middleware req.log(string) function is available
         * @param {Object}   req  request
         * @param {Object}   res  resource
         * @param {function} next next treatment
         */
        middleware: function() {
            var _self = this;
            return function (req, res, next) {
                var info = new _self.HttpInfo(req);
                _self.allowCrossDomain(req, res, _self.options.domains);
                switch (info.getHttpMethod()) {
                case 'OPTIONS':
                    res.header('Access-Control-Allow-Headers', _self.options.allowedHeaderFields.join(', '));
                    res.header('Access-Control-Allow-Methods', _self.options.allowedMethods.join(', '));
                    res.log('Cors: ' + _self.options.allowedHeaderFields.join(', '));
                    break;
                default:
                }
                next();
            };
        }
    };


    module.exports = CorsMiddleware;
})();