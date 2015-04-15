(function () {
    'use strict';

    var AclMiddleware = function (options) {
        this.options = require('extend')({
            resources:{}
        }, options);
        this.HttpInfo = require('../helpers/http-info.js');
    };

    AclMiddleware.prototype = {

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
                var info = new _self.HttpInfo(req);
                var resName = info.getResourceName();
                var resConfig = _self.options.resources[resName];
                if ((resConfig) && (resConfig.acl[info.getHttpMethod()])) {
                    var role = (res['access-token'] ? res['access-token'].role : 'anonymous');
                    if (_self.hasRole(resConfig.acl[info.getHttpMethod()], role)) {
                        res.log('Role: ' + role)
                        next();
                    } else {
                        res.log('Resource ' + resName + ' is not allowed to ' + role);
                        res.status(401).send('unauthorized');
                    }
                } else {
                    res.log('Request bad resource: ' + resName);
                    res.status(404).send('Not found');
                }
            };
        },
        /**
         * Check if a role is in the list
         * @param   {String|Array} list One role or List of roles
         * @param   {String}       role Role to check
         * @returns {Boolean}  True if 'role' is in the 'list'
         */
        hasRole: function(list, role) {
            var roleList = ('[object Array]' === Object.prototype.toString.call(list) ? list : [list]);
            if ((roleList.indexOf('all')>-1) || (roleList.indexOf(role)>-1)) {
                return true;
            }
            return false;
        }
    };

    module.exports = AclMiddleware;
})();