(function () {
    var seed = function(options) {
        var UserService = require(options.basePath + '/app/dao/user-table.js');
        var userTable = new UserService({
            db: options.db
        });

        var defered = q.defer();
        userTable.remove({login:options.data.login}).then(
            function(data){
                userTable.insert(options.data).then(
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
        )
        return defered.promise;
    };
    
    module.exports = seed;

})();