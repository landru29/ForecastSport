(function () {

    var config = require('../app/config.json');
    require('extend')(config, require('../app/authentification.json'));
    var Database = require('../app/services/database.js');
    var db = (new Database(config.db)).getDatabase();
    GLOBAL.q = require('q');
    var seedData = require('./seeds.json');

    require('fs').readdir('./seeds', function (err, files) {
        var promises = [];
        for (var i in files) {
            console.log('Seeding ' + files[i].replace(/\.js$/, ''));
            var thisSeed = seedData[files[i].replace(/\.js$/, '')];
            thisSeed = (thisSeed ? thisSeed : {});
            thisSeed = ('[object Array]' === Object.prototype.toString.call(thisSeed) ? thisSeed : [thisSeed]);
            for (n in thisSeed) {
                promises.push(require('./seeds/' + files[i])({
                    config: config,
                    db: db,
                    data: thisSeed[n],
                    basePath: __dirname + '/..'
                }));
            }
        }
        q.all(promises).then(
            function(data){
                console.log('Success !');
                db.close();
            }, 
            function(err){
                console.log(err);
                db.close();
            }
        );
    });

})();