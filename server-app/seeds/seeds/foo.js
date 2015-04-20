(function () {
    var seed = function(options) {
        /*var Foo = options.dao.Model('foo');
        var FooQuery = options.dao.Query('foo');
        
        */
        
        // data to insert can be available in options.data if set in seeds.json

        var defered = q.defer();
        defered.resolve();
        return defered.promise;
    };
    
    module.exports = seed;

})();