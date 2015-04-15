(function () {

    var Obj = function (router, options) {
        this.router = router;
        this.options = require('extend')({}, options);
        for(func in this) {
            if ((func.match(/^[A-Z0-9]*$/)) && ('function' === typeof this[func])) {
                this[func]();
            }
        }
    };

    Obj.prototype = {
        GET: function () {
            this.router.get('/', function (req, res) {
                // Code here
                res.send();
            });
        },
        POST: function () {
            this.router.post('/', function (req, res) {
                // Code here
                res.send();
            });
        },
        PUT: function () {
            this.router.put('/', function (req, res) {
                // Code here
                res.send();
            });
        },
        DELETE: function () {
            this.router.delete('/', function (req, res) {
                // Code here
                res.send();
            });
        },
    };

    module.exports = function (router, options) {
        new Obj(router, options);
        return router;
    };

})();