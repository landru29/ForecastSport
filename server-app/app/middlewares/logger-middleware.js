(function () {
    'use strict';

    var LoggerMiddleware = function (logger) {
        this.logger = logger;
    };

    LoggerMiddleware.prototype = {
        /**
         * Generate a unique ID
         * @returns {String} Unique ID
         */
        generateUUID: function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });
            return uuid;
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
                res.uuid = _self.generateUUID();
                res.log = function (message) {
                    //console.log(loggerObj.logger);
                    if (_self.logger) {
                        _self.logger.log('(' + res.uuid + '): ' + message);
                    }
                };
                next();
            };
        }
    };


    module.exports = LoggerMiddleware;
})();