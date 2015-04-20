(function () {

    var config = require('../app/config.json');
    require('extend')(config, require('../app/authentification.json'));
    var Database = require('../app/helpers/database.js');
    GLOBAL.q = require('q');
    var db = (new Database(config.db)).getDatabase();
    var dao = new(require('../app/helpers/dao.js'))({
        query: {
            path: __dirname + '/../app/dao',
            pattern: /-query\.js$/
        },
        model: {
            path: __dirname + '/../app/dao',
            pattern: /-model\.js$/
        },
        database: db
    });
    var seedData = require('./seeds.json');

    require('fs').readdir('./seeds', function (err, files) {
        var promises = [];
        for (var i in files) {
            console.log('Seeding ' + files[i].replace(/\.js$/, ''));
            var thisSeed = seedData[files[i].replace(/\.js$/, '')];
            thisSeed = (thisSeed ? thisSeed : {});
            thisSeed = ('[object Array]' === Object.prototype.toString.call(thisSeed) ? thisSeed : [thisSeed]);
            for (n in thisSeed) {
                console.log('  * ' + n);
                promises.push(require('./seeds/' + files[i])({
                    config: config,
                    dao: dao,
                    data: thisSeed[n],
                    basePath: __dirname + '/..'
                }));
            }
        }
        q.all(promises).then(
            function (data) {
                console.log('Success !');
                db.close();
            },
            function (err) {
                console.log(err);
                db.close();
            }
        );
    });

})();