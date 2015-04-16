(function () {

    var Obj = function (router, options) {
        this.router = router;
        this.options = require('extend')({}, options);
        // All services are available in this.options.services
        
        // launch all uppercase functions of the prototype
        for(var func in this) {
            if ((func.match(/^[A-Z0-9]*$/)) && ('function' === typeof this[func])) {
                this[func]();
            }
        }
    };

    Obj.prototype = {
        POST: function () {
            var _self = this;
            this.router.post('/', function (req, res) {
                if (res['refresh-token']) {
                    _self.options.services.oAuth.getAccessTokenFromId(res['refresh-token']).then(
                        function(data){
                            res.send({'accessToken':data});
                        }, 
                        function(err){
                            res.status(403).send({message: '_You are not allowed to perform this operation'});
                        }
                    );
                } else {
                    res.status(403).send({message: 'You are not allowed to perform this operation'});
                }
            });
        }
    };

    module.exports = function (router, options) {
        new Obj(router, options);
        return router;
    };

})();