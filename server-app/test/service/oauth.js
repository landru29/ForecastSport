require('../setup.js');

(function () {

    var OAuthService = require(appFolder + '/services/oauth.js');


    describe("service/OAuth", function () {
        it("Generate keys", function (done) {
            var oauth = new OAuthService({
                dao: dao,
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
