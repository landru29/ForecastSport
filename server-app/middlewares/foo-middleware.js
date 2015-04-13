(function () {
    'use strict';

    var FooMiddleware = function () {
    };

    FooMiddleware.prototype = {

        /**
         * Express Middleware to manage LOG
         * In each middleware req.log(string) function is available
         * @param {Object}   req  request
         * @param {Object}   res  resource
         * @param {function} next next treatment
         */
        middleware: function () {
            var _self = this;
            return function(req, res, next) {
                next();
            };
        }
    };

    module.exports = function () {
        return new FooMiddleware();
    };
})();