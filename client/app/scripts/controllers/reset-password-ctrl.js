/*global angular */
angular.module('ForecastDerby').controller('ResetPasswordCtrl', ['$scope', '$routeParams', 'OAuthHttp', '$rootScope', '$location',
    function ($scope, $routeParams, OAuthHttp, $rootScope, $location) {
        "use strict";
        $scope.data = {
            login: $routeParams.login
        };

        $scope.updatePassword = function () {
            var token = $routeParams.token.replace(/\s/g, '');
            OAuthHttp.updatePassword($scope.password, token).then(
                function (data) {
                    $rootScope.$broadcast('display-message', {
                        type: 'success',
                        message: 'Your password is updated'
                    });
                    $location.path('/');
                },
                function (err) {
                    $rootScope.$broadcast('display-message', {
                        type: 'warning',
                        message: 'Error! ' + err
                    });
                }
            );
        };
}]);