(function () {
    var seed = function(options) {
        /*var FooService = require(options.basePath + '/app/dao/foo-table.js');
        var fooTable = new FooService({
            db: options.db
        });*/
        
        // data to insert can be available in options.data if set in seeds.json

        var defered = q.defer();
        defered.resolve();
        return defered.promise;
    };
    
    module.exports = seed;

})();