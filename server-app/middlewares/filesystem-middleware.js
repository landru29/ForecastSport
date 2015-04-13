(function () {
    'use strict'

    var FileSystemMiddleware = function (options) {
        this.options = require('extend')({
            basePath: '.',
            public: {
                folder: '.',
                default: 'index.html'
            }
        }, options);
    }

    FileSystemMiddleware.prototype = {
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
         * Get the full path of a requested file
         * @param  {object} req request object
         * @return {string}     full path
         */
        getFullPath: function (req) {
            // delete first '/' if exists and all the string after a '?'
            var resource = req.url.replace(/^\//, '').replace(/[\?].*/, '');
            return resource.length > 0 ? resource : null;
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
            var fs = require('fs');
            return function (req, res, next) {
                var publicFolder = _self.options.basePath + '/' + _self.options.public.folder;
                switch (_self.getHttpMethod(req)) {
                case 'GET':
                    var requestedPath = _self.getFullPath(req);
                    var requestedUrl = ((req.url) && (req.url.length > 1) ? req.url : '/' + _self.options.public.default);
                    var filename = publicFolder + requestedUrl;
                    // check if a specific file was requested
                    if ((requestedUrl) && (fs.existsSync(filename))) {
                        res.log('Serving file ' + requestedUrl);
                        res.sendfile(requestedUrl, {
                            root: publicFolder
                        });
                    } else {
                        res.log('File ' + filename + ' not found. serving the resource');
                        next();
                    }
                    break;
                default:
                    next();
                }
            };
        }
    };


    module.exports = function (options) {
        return new FileSystemMiddleware(options);
    };
})();