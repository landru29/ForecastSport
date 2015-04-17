(function () {

    var Obj = function (router, options) {
        this.router = router;
        this.options = require('extend')({}, options);
        this.services = this.options.services;
        // All services are available in this.services
        
        // launch all uppercase functions of the prototype
        for(var func in this) {
            if ((func.match(/^[A-Z0-9]*$/)) && ('function' === typeof this[func])) {
                this[func]();
            }
        }
    };

    Obj.prototype = {
        GET: function () {
            var _self = this;
            this.router.get('/', function (req, res) {
                // Code here
                res.send();
            });
        },
        POST: function () {
            var _self = this;
            this.router.post('/', function (req, res) {
                // Code here
                res.send();
            });
        },
        PUT: function () {
            var _self = this;
            this.router.put('/', function (req, res) {
                // Code here
                res.send();
            });
        },
        DELETE: function () {
            var _self = this;
            this.router.delete('/', function (req, res) {
                // Code here
                res.send();
            });
        }
    };

    module.exports = function (router, options) {
        new Obj(router, options);
        return router;
    };

})();