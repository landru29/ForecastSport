(function () {

    var Obj = function (router, options) {
        this.router = router;
        this.options = require('extend')({}, options);
        this.services = this.options.services;
        // All services are available in this.services

        // launch all uppercase functions of the prototype
        for (var func in this) {
            if ((func.match(/^[A-Z0-9]*$/)) && ('function' === typeof this[func])) {
                this[func]();
            }
        }
    };

    Obj.prototype = {
        GET: function () {
            var _self = this;
            this.router.get('/', function (req, res) {
                var email = req.query.email;
                var redirection = req.query.redirection;
                if ((!email) || (!redirection)) {
                    res.status(403).send('No email or no redirection was specified');
                } else {
                    _self.services.user.resetPassword(email, redirection).then(
                        function (data) {
                            res.send({
                                message: 'email send'
                            });
                        },
                        function (err) {
                            res.status(403).send('Unknown user');
                        }
                    );

                }
            });
        },
        POST: function () {
            var _self = this;
            this.router.post('/', function (req, res) {
                if ((req.body.token) && (req.body.password)) {
                     _self.services.user.updatePassword(req.body.password, req.body.token).then(
                        function (data) {
                            res.send({
                                message: 'Password updated'
                            });
                        },
                        function (err) {
                            res.status(403).send('Could not update password');
                        }
                    );
                } else {
                    res.status(403).send('Invalid parameters');
                }
            });
        }
    };

    module.exports = function (router, options) {
        new Obj(router, options);
        return router;
    };

})();