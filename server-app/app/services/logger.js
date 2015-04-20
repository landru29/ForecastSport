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
            var pidColor = (process.pid % 7) + 31;
            var date = (new Date()).toISOString();
            var formatedMessage = JSON.stringify(message).replace(/^"/,'').replace(/"$/,'');
            var toDisplay = (level ? "\x1b[31m" + level[0].toUpperCase() + ' ' : '  ') + "\x1b[33m" + date + " \x1b[" + pidColor + "m[" + process.pid + "]\x1b[0m " + formatedMessage;
            var toLog = (level ? level[0].toUpperCase() + ' ' : '  ') + date + '[' + process.pid + '] > ' + formatedMessage;
            console.log(toDisplay);
            if (Logger.prototype.logStream) {
                Logger.prototype.logStream.write(toLog + "\n");
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


    module.exports = Logger;
    /*module.exports = function (options) {
        var logger = new Logger(options);
        logger.openStream();
        return logger;
    };*/
})();