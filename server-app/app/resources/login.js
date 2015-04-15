(function () {

    var Obj = function (router, options) {
        this.router = router;
        this.options = require('extend')({}, options);
        // All services are available in this.options.services

        // launch all uppercase functions of the prototype
        for (var func in this) {
            if ((func.match(/^[A-Z0-9]*$/)) && ('function' === typeof this[func])) {
                this[func]();
            }
        }
    };

    Obj.prototype = {
        POST: function () {
            var _self = this;
            this.router.post('/', function (req, res) {
                if ((req.body.login) && (req.body.password)) {
                    _self.options.services.oAuth.requestTokens(req.body.login, req.body.password).then(
                        function (data) {
                            res.send(data);
                        },
                        function (err) {
                            res.status(403).send({
                                message: 'connection refused'
                            });
                        }
                    );
                } else {
                    res.status(403).send({
                        message: 'missing parameters'
                    });
                }
            });
        }
    };

    module.exports = function (router, options) {
        new Obj(router, options);
        return router;
    };

})();