require('./setup.js');

(function () {



    describe("Users", function () {
        it("Insert and read", function (done) {
            var userTable = require('../services/user-table.js')({
                db: db
            });
            var user = {
                name: 'mickey',
                login: 'login',
                email: 'bob@gmail.com',
                password: 'kiki'
            };
            userTable.insert(user).then(
                function (data) {
                    var userFilter = {
                        login: 'login',
                        password: 'kiki'
                    };
                    userTable.getOne(userFilter).then(function (doc) {
                        try {
                            assert.equal(doc.login, 'login', 'login sould be "login"');
                        } catch (e) {
                            done(e);
                        }
                        done();
                    }, function (err) {
                        done(err);
                    });
                },
                function (err) {
                    done(err);
                }
            );

        });

        it("Mendatory login", function (done) {
            var userTable = require('../services/user-table.js')({
                db: db
            });
            var user = {
                name: 'mickey',
                password: 'kiki',
                email: 'bob@gmail.com',
            };
            userTable.insert(user).then(
                function (data) {
                    done('Should not insert the user without login');
                },
                function (err) {
                    done();
                }
            );

        });
        
        it("Mendatory password", function (done) {
            var userTable = require('../services/user-table.js')({
                db: db
            });
            var user = {
                name: 'mickey',
                login:'papanoel',
                email: 'bob@gmail.com',
            };
            userTable.insert(user).then(
                function (data) {
                    done('Should not insert the user without password');
                },
                function (err) {
                    done();
                }
            );

        });
        
        it("Mendatory email", function (done) {
            var userTable = require('../services/user-table.js')({
                db: db
            });
            var user = {
                name: 'mickey',
                login:'papanoel',
                password: 'kiki',
            };
            userTable.insert(user).then(
                function (data) {
                    done('Should not insert the user without email');
                },
                function (err) {
                    done();
                }
            );

        });

        it("Insert twice", function (done) {
            var userTable = require('../services/user-table.js')({
                db: db
            });
            var user = {
                name: 'mickey',
                login: 'login',
                password: 'kiki',
                email: 'bob@gmail.com',
            };
            userTable.insert(user).then(
                function (data) {
                    done('Should not insert the same user');
                },
                function (err) {
                    done();
                }
            );

        });

        it("Unknown user", function (done) {
            var userTable = require('../services/user-table.js')({
                db: db
            });
            var userFilter = {
                login: 'login',
                password: 'rocco'
            };
            userTable.getOne(userFilter).then(function (doc) {
                done('Should not retrieve any users');
            }, function (err) {
                done();
            });

        });
        
        it("update user", function (done) {
            var userTable = require('../services/user-table.js')({
                db: db
            });
            var user = {
                login: 'login',
                name: 'plutot',
                password: 'Sissi l\'impératrice'
            };
            userTable.update(user).then(function (doc) {
                try {
                    expect(doc.name).toBe(user.name);
                } catch (e) {
                    done(e);
                }
                done();
            }, function (err) {
                done('Should update the user');
            });

        });
        
    });
})();