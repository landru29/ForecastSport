GLOBAL.q = require('q');

(function () {

    var db = (function () {
        var database = {
            host: 'localhost',
            port: 27017,
            database: 'testForecast'
        };
        return require('monk')(database.host + ':' + database.port + '/' + database.database);
    })();


    var conf = require('./test.json');
    
    var launchOneTest = function(obj, callbacks, index) {
        if (index>=callbacks.length) {
            var defered = q.defer();
            defered.resolve();
            return defered.promise;
        } else {
            var defered = q.defer();
            console.log('   * ' + callbacks[index]);
            obj[callbacks[index]]().then(function(){
                launchOneTest(obj, callbacks, index+1).then(function(){
                    defered.resolve();
                });
            });
            return defered.promise;
        }
    };

    var executeTests = function (test) {
        var callbacks = [];
        for (var i in test) {
            if ((i.match(/test.*/)) && ('function' === typeof test[i])) {
                callbacks.push(i);
            }
        }
        callbacks.sort();
        try {
            return launchOneTest(test, callbacks, 0);
        } catch (e) {
            console.log(e);
        }
    };

    var executeAlltests = function () {
        var testsP = [];
        for (var n in conf.files) {
            console.log('Executing ' + conf.files[n]);
            testsP.push(
                executeTests(
                    require(__dirname + '/' + conf.files[n])({
                        db: db
                    })
                )
            );
        }
        q.all(testsP).then(function () {
            console.log('success');
            db.close();
        }, function (err) {
            console.log(err);
            db.close();
        });
    };
    
    var dropTable = function(name) {
        return db.get(name).drop();
    };

    var dropAlltables = function () {
        var defered = q.defer();
        db.driver.collectionNames(function (e, names) {
            var promises = [];
            for (var i in names) {
                if ('system.indexes' !== names[i].name) {
                    promises.push(dropTable(names[i].name));
                }
            }
            q.all(promises).then(function() {
                console.log('DB is clean');
                defered.resolve();
            }, function(err) {
                 console.log('DB is not clean');
                console.log(err);
                defered.resolve();
            });
        });
        return defered.promise;
    };
    
    dropAlltables().then(function() {
        executeAlltests();
    });

})();