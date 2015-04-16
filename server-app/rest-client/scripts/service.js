/*global angular */
angular.module('restClient').provider('OAuthHttp', [function () {

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
        http: function (request) {
            var defered = this.injections.q.defer();
            var _self = this;
            var attempt = (arguments.length > 1 ? arguments[1] : 2);
            if (attempt) {
                var thisRequest = JSON.parse(JSON.stringify(request));
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