/*global angular */
angular.module('ForecastDerby').controller('ModalConnectCtrl', ['$scope', '$rootScope', '$modalInstance',
    function ($scope, $rootScope, $modalInstance) {
        'use strict';



        $scope.close = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.connect = function () {
            /*Parse.User.logIn($scope.username, $scope.password, {
                success: function (user) {
                    $scope.password = '';
                    $scope.close();
                    $rootScope.$broadcast('menu-reload', {});
                },
                error: function (user, error) {
                    $scope.password = '';
                }
            });*/
        };

        $scope.resetPassword = function () {
            /*Parse.User.requestPasswordReset($scope.email).then(function () {
                $rootScope.$broadcast('display-message', {
                    type: 'success',
                    message: 'You will recieve an email'
                });
            }, function () {
                $rootScope.$broadcast('display-message', {
                    type: 'warning',
                    message: 'No user found with this email'
                });
            });*/
            $scope.close();
        };

    }]);
