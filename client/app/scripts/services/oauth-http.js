/*global angular */
angular.module('ForecastDerby').provider('OAuthHttp', [function () {

    var accessToken = null;
    var refreshToken = null;

    var serverUrl = null;

    /**
     * Configure the server URL
     * @param {string} url URL of the OAuth server
     */
    this.setServerUrl = function (url) {
        serverUrl = url;
    };

    var OAuthHttp = function (q, http) {
        this.injections = {
            q: q,
            http: http
        };
    };

    OAuthHttp.prototype = {
        /**
         * Refresh the access token
         * @returns {Promise}
         */
        refreshMyToken: function () {
            var defered = this.injections.q.defer();
            if (serverUrl) {
                var request = {
                    url: serverUrl + '/refresh-token',
                    method: 'POST',
                    headers: {
                        'refresh-token': refreshToken
                    }
                };
                this.injections.http(request).then(function (response) {
                    accessToken = response.data.accessToken;
                    defered.resolve();
                }, function (err) {
                    defered.reject(err);
                });
            } else {
                defered.reject('Unknown OAuth server URL');
            }
            return defered.promise;
        },
        
        /**
         * Login a user
         * @param   {String} login    User Identifier
         * @param   {String} password User password
         * @returns {promise} resolved if success
         */
        login: function (login, password) {
            var defered = this.injections.q.defer();
            if (serverUrl) {
                this.injections.http.post(serverUrl + '/login', {
                    login: login,
                    password: password
                }).then(function (response) {
                    refreshToken = response.data.refreshToken;
                    accessToken = response.data.accessToken;
                    defered.resolve();
                }, function (err) {
                    defered.reject(err);
                });
            } else {
                defered.reject('Unknown OAuth server URL');
            }
            return defered.promise;
        },
        
        /**Request for a password reset
         * @param   {String} email user email
         * @returns {Promise}
         */
        resetPassword: function(email) {
            var defered = this.injections.q.defer();
            var redirection = window.location.origin + '/#/reset-password';
            var query = serverUrl + '/reset-password?email=' + encodeURIComponent(email) + '&redirection=' + encodeURIComponent(redirection);
            this.injections.http.get(query).then(
                function(response){
                    defered.resolve(response.data);
                }, 
                function(err){
                    defered.reject(err.data);
                }
            );
            return defered.promise;
        },
        
        /**
         * Update the password
         * @param   {String} password new password
         * @param   {String} token    token given by the api
         * @returns {Promise}
         */
        updatePassword: function(password, token) {
            var defered = this.injections.q.defer();
            this.injections.http.post(serverUrl + '/reset-password', {password: password, token: token}).then(
                function(response){
                    defered.resolve(response.data);
                }, 
                function(err){
                    defered.reject(err.data);
                }
            );
            return defered.promise;
        },
        
        /**
         * Logout a user
         * @returns {Promise} always resolved
         */
        logout: function () {
            var defered = this.injections.q.defer();
            refreshToken = null;
            accessToken = null;
            defered.resolve();
            return defered.promise;
        },
        
        /**
         * Ask for identity
         * @returns {Promise} if resolved, get the user Object
         */
        whoAmI: function() {
            var defered = this.injections.q.defer();
            if ((!accessToken) && (!refreshToken)) {
                defered.reject();
            } else {
                this.http({
                    method: 'GET',
                    resource: '/user'
                }).then(
                    function(response){
                        defered.resolve(response.data);
                    }, 
                    function(){
                        defered.reject();
                    }
                );
            }
            return defered.promise;
        },
        
        /**
         * Perform a HTTP request and manage the token renewal
         * @param   {Object} request See $http of Angularjs
         * @returns {Promise} See $http of Angularjs
         */
        http: function (request) {
            var defered = this.injections.q.defer();
            var _self = this;
            var attempt = (arguments.length > 1 ? arguments[1] : 2);
            if (attempt) {
                var thisRequest = JSON.parse(JSON.stringify(request));
                thisRequest.url = serverUrl + '/' + thisRequest.resource.replace(/^\//, '');
                delete thisRequest.resource;
                if (accessToken) {
                    thisRequest.headers = (thisRequest.headers ? thisRequest.headers : {});
                    thisRequest.headers['access-token'] = accessToken;
                    this.injections.http(thisRequest).then(
                        function (data) {
                            defered.resolve(data);
                        },
                        function (err) {
                            if (err.data.message === 'TokenExpiredError') {
                                _self.refreshMyToken().then(
                                    function () {
                                        _self.http(request, attempt - 1).then(
                                            function (data) {
                                                defered.resolve(data);
                                            },
                                            function (err) {
                                                defered.reject(err);
                                            }
                                        );
                                    },
                                    function (err) {
                                        defered.reject(err);
                                    }
                                );
                            } else {
                                defered.reject(err);
                            }
                        }
                    );
                } else {
                    this.refreshMyToken().then(
                        function () {
                            _self.http(request, attempt - 1).then(
                                function (data) {
                                    defered.resolve(data);
                                },
                                function (err) {
                                    defered.reject(err);
                                }
                            );
                        },
                        function (err) {
                            defered.reject(err);
                        }
                    );
                }
            } else {
                defered.reject('Impossible to refresh the token');
            }
            return defered.promise;
        }
    };


    this.$get = ['$q', '$http', function ($q, $http) {
        return new OAuthHttp($q, $http);
    }];

}]);