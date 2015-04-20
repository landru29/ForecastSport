require('../setup.js');

(function () {
    describe('Dao/User', function () {

        it("Insert and read", function (done) {
            var User = dao.Model('user');
            var Query = dao.Query('user');
            var user = new User({
                name: 'mickey',
                login: 'login',
                email: 'bob@gmail.com',
                password: 'kiki'
            });
            user.save().then(
                function () {
                    var userFilter = {
                        login: 'login',
                        password: 'kiki'
                    };
                    (new Query()).getOne(userFilter).then(
                        function (doc) {
                            try {
                                assert.equal(doc.get('login'), 'login', 'login sould be "login"');
                            } catch (e) {
                                done(e);
                                return;
                            }
                            done();
                        },
                        function (err) {
                            done(err);
                        }
                    );
                },
                function (err) {
                    done(err);
                }
            );
        });

        it("Mendatory login", function (done) {
            var User = dao.Model('user');
            var user = new User({
                name: 'mickey',
                password: 'kiki',
                email: 'bob@gmail.com',
            });

            user.save().then(
                function (data) {
                    done('Should not insert the user without login');
                },
                function (err) {
                    done();
                }
            );
        });


        it("Mendatory password", function (done) {
            var User = dao.Model('user');
            var user = new User({
                name: 'mickey',
                login: 'kiki',
                email: 'bob@gmail.com',
            });

            user.save().then(
                function (data) {
                    done('Should not insert the user without login');
                },
                function (err) {
                    done();
                }
            );
        });


        it("Mendatory email", function (done) {
            var User = dao.Model('user');
            var user = new User({
                name: 'mickey',
                login: 'papanoel',
                password: 'kiki',
            });

            user.save().then(
                function (data) {
                    done('Should not insert the user without login');
                },
                function (err) {
                    done();
                }
            );
        });

        it("Insert twice", function (done) {
            var User = dao.Model('user');
            var user1 = new User({
                name: 'mickey-mouse',
                login: 'login',
                password: 'kiki',
                email: 'bob@gmail.com',
            });
            var user2 = new User({
                name: 'mickey-mouse',
                login: 'login',
                password: 'kiki',
                email: 'bob@gmail.com',
            });
            user1.save().then(
                function (data) {
                    user2.save().then(
                        function () {
                            done('Should not insert the same user');
                        },
                        function (err) {
                            done();
                        }
                    );
                },
                function (err) {
                    done(err);
                }
            );

        });

        it("Unknown user", function (done) {
            var Query = dao.Query('user');
            var userFilter = {
                login: 'login',
                password: 'rocco'
            };
            (new Query()).getOne(userFilter).then(function (doc) {
                done('Should not retrieve any users');
            }, function (err) {
                done();
            });

        });


        it("update user", function (done) {
            var User = dao.Model('user');
            var user = new User({
                name: 'mickey',
                login: 'login',
                password: 'kiki',
                email: 'bob@gmail.com',
            });

            user.save().then(
                function () {
                    user.set('name', 'plutot');
                    user.save().then(
                        function (data) {
                            try {
                                expect(data.get('name')).toBe('plutot');
                            } catch (e) {
                                done(e);
                                return;
                            }
                            done();
                        },
                        function (err) {
                            done('Should update the user');
                        }
                    );
                },
                function (err) {
                    done(err);
                }
            );

        });


    });

})();