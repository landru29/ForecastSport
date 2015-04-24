(function () {

    

    var Obj = function (router, options) {
        this.router = router;
        this.options = require('extend')({}, options);
        this.services = this.options.services;
        // All services are available in this.services

        // launch all uppercase functions of the prototype
        for (var func in this) {
            if ((func.match(/^[A-Z_0-9]*$/)) && ('function' === typeof this[func])) {
                this[func]();
            }
        }
    };

    Obj.prototype = {
        GET: function () {
            var _self = this;
            this.router.get('/', function (req, res) {

                req.session.redirection = _self.getCurrentUrl(req) + '/done';
                req.session.csrf = _self.services.facebook.generateCsrfToken(req);

                var url = _self.services.facebook.buildConnectUrl(req.session.csrf, req.session.redirection,['email']);
                
                res.log('Redirection to facebook => ' + req.session.csrf);
                res.log(url);
                res.redirect(url);
            });
        },
        GET_DONE: function () {
            var _self = this;
            this.router.get('/done', function (req, res) {
                var state = req.session.csrf;
                if ((state) && (state === req.query.state)) {
                    req.session.access_token = req.query.access_token;
                    res.log('Redirection from facebook => ' + state);
                    _self.services.facebook.requestAccessToken(req.query.code, req.session.redirection).then(
                        function(data){
                            if (data.access_token) {
                                res.log('Facebook access token: ' + data.access_token);
                                _self.services.facebook.requestUserInformation(data.access_token).then(
                                    function(fbUser){
                                        var email = fbUser.email;
                                        var fbId = fbUser.id;
                                        var first_name = fbUser.first_name;
                                        var last_name = fbUser.last_name;
                                        res.log('FB email: ' + email + ' - FB Id: ' + fbId + ' - Name: ' + fbUser.name);
                                        res.redirect(_self.getHost(req) + '/facebook/ready');
                                    }, 
                                    function(err){
                                        res.status(403).send('Could not retrieve user Information from facebook');
                                    }
                                );
                            } else {
                                res.log('No access token from facebook ' + JSON.stringify(data));
                                res.status(403).send('No access token from facebook, please retry');
                            }
                        }, 
                        function(err){
                            res.log('Error connecting facebook ' + JSON.stringify(err));
                            res.status(403).send('Error connecting Facebook');
                        }
                    );
                    delete req.session.csrf;
                    delete req.session.redirection;
                } else {
                    res.log('Facebook authentication failed');
                    res.status(403).send('Facebook authentication failed');
                }

            });
        },
        GET_READY: function () {
            var _self = this;
            this.router.get('/ready', function (req, res) {
                res.send('You can close this window');
            });
        },
        getHost: function(req) {
            var conn = req.connection;
            var headers = req.headers;
            var protocol = (conn.pair || req.https === 'on' || headers['x-forwarded-proto'] === 'https') ? 'https://' : 'http://';
            var host = headers['x-forwarded-host'] || headers.host;
            return protocol + host;
        },
        getCurrentUrl: function (req) {
            var url = require('url');
            var path = req.originalUrl;
            var currentUrl = this.getHost(req) + path;
            var parts = url.parse(currentUrl);
            return url.format(parts);
        }
    };


    module.exports = function (router, options) {
        new Obj(router, options);
        return router;
    };

})();