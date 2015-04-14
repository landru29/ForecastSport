if (!GLOBAL._setupLoaded) {
    GLOBAL._setupLoaded = (function () {

        GLOBAL.expect = require('expect');
        GLOBAL.assert = require('assert');
        GLOBAL.q = require('q');
        GLOBAL.appFolder = __dirname + '/../app';

        /**
         * Drop a table in Mongodb
         * @param   {String} name Name of the table (collection)
         * @returns {Promise} resolved when droppped
         */
        var dropTable = function (name) {
            return db.get(name).drop();
        };

        /**
         * Drop all the tables of a database in mongoDb
         * @returns {Promise} resolved when droppped
         */
        var dropAlltables = function () {
            var defered = q.defer();
            db.driver.collectionNames(function (e, names) {
                var promises = [];
                for (var i in names) {
                    if ('system.indexes' !== names[i].name) {
                        promises.push(dropTable(names[i].name));
                    }
                }
                q.all(promises).then(function () {
                    defered.resolve();
                }, function (err) {
                    console.log('DB is not clean');
                    console.log(err);
                    defered.resolve();
                });
            });
            return defered.promise;
        };

        var loadFixtures = function () {
            var promises = [];
            promises.push(db.get('users').insert({
                name: 'mickey-mouse',
                login: 'mickey-login',
                password: require('crypto').createHash('sha256').update('kiki').digest('hex'),
                email: 'bob@gmail.com',
            }));
            return q.all(promises);
        };

        // Before launching tests, open db
        before(function (done) {
            GLOBAL.db = (function () {
                var database = {
                    host: 'localhost',
                    port: 27017,
                    database: 'testForecast'
                };
                return require('monk')(database.host + ':' + database.port + '/' + database.database);
            })();
            done();
        });

        // Empty database before each test
        beforeEach(function (done) {
            dropAlltables().then(
                function (data) {
                    loadFixtures().then(
                        function (data) {
                            done();
                        },
                        function (err) {
                            done('Could not load fixtures');
                        }
                    );
                },
                function (err) {
                    done('Could not drop database');
                }
            );
        });

        // after testing, close the database
        after(function (done) {
            db.close();
            done();
        });

        return true;

    })();
}