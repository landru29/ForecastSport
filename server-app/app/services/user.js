(function () {
    'use strict';


    var User = function (options) {
        this.options = require('extend')({
            collection: null,
            resetPasswordSecret: null,
            email :null
        }, options);
        this.services = this.options.services;
        var nodemailer = require('nodemailer');
        this.transporter = nodemailer.createTransport(this.options.email);
        this.UserQuery = this.options.dao.Query('user');
        this.UserModel = this.options.dao.Model('user');
    };

    User.prototype = {
        /**
         * Get user public information
         * @param   {String} id User Id
         * @returns {Object} public information about the user
         */
        getInformation: function (id) {
            var defered = q.defer();
            
            (new this.UserQuery()).getById(id).then(
                function(user){
                    defered.resolve({
                        name: user.get('name'),
                        login: user.get('login'),
                        email: user.get('email'),
                        role: user.get('role'),
                    });
                }, 
                function(err){
                    defered.reject('No user found');
                }
            );
            return defered.promise;
        },

        /**
         * Send an email with link to reset the user password
         * @param   {String} email       User email
         * @param   {String} redirection url page to enter the password
         * @returns {Promise}
         */
        resetPassword: function (email, redirection) {
            var defered = q.defer();
            var _self = this;
            (new this.UserQuery()).getAll({
                email: email
            }).then(
                function (users) {
                    var mailOptions = {
                        from: 'ForecastSport <noreply@gmail.com>', // sender address
                        to: email, // list of receivers
                        subject: 'Reset password', // Subject line
                        text: "You requested a password reset\n", // plaintext body
                        html: '<h1>You requested a password reset</h1>' // html body
                    };
                    for (var i in users) {
                        
                        var token = _self.options.services.oAuth.encodeToken(users[i].get(), _self.options.resetPasswordSecret, {expiresInMinutes: 5});
                        var query = '/login/' + encodeURIComponent(users[i].get('login'));
                        query += '/token/' + encodeURIComponent(token);
                        var uri = redirection + query;
                        mailOptions.html += '<div><b>login: </b>' + users[i].get('login') + '</div>';
                        mailOptions.html += '<div><b>reset: </b><a href="' + uri + '">' + uri + '</a></div><br>';
                        mailOptions.text += 'login: ' + users[i].get('login') + "\n";
                        mailOptions.text += 'use this link: ' + uri + "\n";
                        _self.services.logger.log('Link: ' + uri);
                    }
                    _self.services.logger.log('Sending confirmation to ' + email);
                    _self.transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            defered.reject(error);
                        } else {
                            _self.services.logger.log('Mail sent');
                            defered.resolve();
                        }
                    });
                },
                function (err) {
                    defered.reject('No user found');
                }
            );
            return defered.promise;
        },
        
        /**
         * Update the password
         * @param   {String} password New password
         * @param   {String} token    Token for password reset
         * @returns {Promise}
         */
        updatePassword: function(password, token) {
            var defered = q.defer();
            var _self = this;
            if (password) {
                _self.services.oAuth.decodeToken(token, _self.options.resetPasswordSecret).then(
                    function(userData){
                        (new _self.UserQuery()).getById(userData._id).then(
                            function(user){
                                user.set('password', password);
                                user.save().then(
                                    function(){
                                        defered.resolve();
                                    }, 
                                    function(err){
                                        defered.reject('Could not update the user');
                                    }
                                );
                            }, 
                            function(err){
                                defered.reject('Could not find the user');
                            }
                        );
                    }, 
                    function(err){
                        defered.reject(err);
                    }
                );
            } else {
                defered.reject('No password specified');
            }
            return defered.promise;
        }
    };

    module.exports = User;
})();