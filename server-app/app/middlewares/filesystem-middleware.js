(function () {
    'use strict';

    var FileSystemMiddleware = function (options) {
        this.options = require('extend')({
            basePath: '.',
            public: {
                folder: '.',
                default: 'index.html'
            }
        }, options);
        this.publicFolder = require('path').normalize(this.options.basePath + '/' + this.options.public.folder);
        this.HttpInfo = require('../helpers/http-info.js');
    };

    FileSystemMiddleware.prototype = {

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
                var info = new _self.HttpInfo(req);
                switch (info.getHttpMethod()) {
                case 'GET':
                    var requestedPath = info.getFullPath();
                    var requestedUrl = ((req.url) && (req.url.length > 1) ? req.url : '/' + _self.options.public.default).replace(/\.\./g, '');
                    var filename = _self.publicFolder + requestedUrl;
                    // check if a specific file was requested
                    if ((requestedUrl) && (fs.existsSync(filename))) {
                        res.log('Serving file ' + requestedUrl);
                        res.sendfile(requestedUrl, {
                            root: _self.publicFolder
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


    module.exports = FileSystemMiddleware;
})();