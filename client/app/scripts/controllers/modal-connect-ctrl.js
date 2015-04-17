/*global angular */
angular.module('ForecastDerby').controller('ModalConnectCtrl', ['$scope', '$rootScope', '$modalInstance', 'OAuthHttp', 'focus',
    function ($scope, $rootScope, $modalInstance, OAuthHttp, focus) {
        'use strict';

        focus('username');

        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.connect = function () {
            OAuthHttp.login($scope.username, $scope.password).then(
                function(data){
                    $scope.password = '';
                    $scope.close();
                    $rootScope.$broadcast('menu-reload', {});
                }, 
                function(err){
                    $scope.password = '';
                }
            );
        };

        $scope.resetPassword = function () {
            OAuthHttp.resetPassword($scope.email).then(function () {
                $rootScope.$broadcast('display-message', {
                    type: 'success',
                    message: 'You will recieve an email'
                });
            }, function () {
                $rootScope.$broadcast('display-message', {
                    type: 'warning',
                    message: 'No user found with this email'
                });
            });
            $scope.close();
        };

    }]);
