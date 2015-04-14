(function () {
    'use strict';
    
    /**
     * Logger constructor
     * @param {Object}  options options to pass to the object
     */
    var Logger = function (options) {
        this.options = require('extend')({
            file: __dirname + '/../access.log'
        }, options);
    };

    Logger.prototype = {
        /**
         * Log a message
         * @param {String} level   Optional level
         * @param {String} message Message to log
         */
        log: function (message, level) {
            var toDisplay = (level ? level[0].toUpperCase() + ' ' : '  ') + (new Date()).toISOString() + '[' + process.pid + ']: > ' + message;
            console.log(toDisplay);
            if (Logger.prototype.logStream) {
                Logger.prototype.logStream.write(toDisplay + "\n");
            }
        },
        /**
         * Open the stream
         * @param {boolean} force   if set the file will be opened; otherwise, the file is opened only it was not previously
         */
        openStream: function (force) {
            if ((this.options.file) && ((force) || (!Logger.prototype.logStream))) {
                Logger.prototype.logStream = require('fs').createWriteStream(this.options.file, {
                    flags: 'a'
                });
            }
        }
    };


    module.exports = function (options) {
        var logger = new Logger(options);
        logger.openStream();
        return logger;
    };
})();