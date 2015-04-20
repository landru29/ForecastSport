(function () {
    var seed = function(options) {
        var User = options.dao.Model('user');
        var UserQuery = options.dao.Query('user');

        var defered = q.defer();
        
        (new UserQuery()).remove({login:options.data.login}).then(
            function(){
                (new User(options.data)).save().then(
                    function(data){
                        defered.resolve(data);
                    }, 
                    function(err){
                        defered.reject(err);
                    }
                )
            }, 
            function(err){
                defered.reject(err);
            }
        );
        return defered.promise;
    };
    
    module.exports = seed;

})();