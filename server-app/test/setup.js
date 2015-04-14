 (function () {

     GLOBAL.expect = require('expect');
     GLOBAL.assert = require('assert');
     GLOBAL.q = require('q');

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

     // Before each test, open db and clean it
     before(function (done) {
         GLOBAL.db = (function () {
             var database = {
                 host: 'localhost',
                 port: 27017,
                 database: 'testForecast'
             };
             return require('monk')(database.host + ':' + database.port + '/' + database.database);
         })();

         dropAlltables().then(
             function (data) {
                 done();
             },
             function (err) {
                 done();
             }
         );

     });

     // after each test, close the database
     after(function (done) {
         db.close();
         done();
     });

 })();