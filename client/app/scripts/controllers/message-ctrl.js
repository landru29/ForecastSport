/*global angular */
angular.module('ForecastDerby').controller('MessageCtrl', ['$scope', '$timeout',
    function ($scope, $timeout) {
        "use strict";

        $scope.messages = {};
        
        $scope.newMessage = function(message) {
            var uid = new Date().getTime().toString(16).toUpperCase();
            $scope.messages[uid] = angular.extend({uid: uid}, message);
            $timeout(function(){
                $scope.destroy(uid);
            }, 5000);
        };
        
        $scope.destroy = function(uid) {
            if ($scope.messages[uid]) {
                delete $scope.messages[uid];
            }
        };
        
        $scope.$on('display-message', function(event, args) {
            console.log(args);
            $scope.newMessage(args);
        });
        
}]);
