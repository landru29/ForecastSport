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
                res.log(res.userId);
                var Query = _self.options.dao.Query('user');
                (new Query()).getById(res.userId).then(
                    function(user){
                        res.send(user.getInformation());
                    }, 
                    function(err){
                        res.log(err);
                        res.status(403).send('An error occured when reading user');
                    }
                );
            });
        }
    };

    module.exports = function (router, options) {
        new Obj(router, options);
        return router;
    };

})();