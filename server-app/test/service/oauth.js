require('../setup.js');

(function () {

    var UserTable = require(appFolder + '/dao/user-table.js');
    var OAuthService = require(appFolder + '/services/oauth.js');


    describe("service/OAuth", function () {
        it("Generate keys", function (done) {
            var userTable = new UserTable({
                db: db
            });
            var oauth = new OAuthService({
                userTable: userTable,
                secretRefresh: 'baobab',
                secretAccess: 'tarzan'
            });
            oauth.requestTokens('mickey-login', 'kiki').then(
                function(data){
                    done();
                }, 
                function(err){
                    done(err);
                }
            );
        });

        
        
    });
})();
