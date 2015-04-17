/*global angular */
angular.module('ForecastDerby').directive('focus', function () {
    return function (scope, elem, attr) {
        scope.$on('focusOn', function (e, name) {
            if (name === attr.focus) {
                elem[0].focus();
            }
        });
    };
}).factory('focus', function ($rootScope, $timeout) {
    return function (name) {
        $timeout(function () {
            $rootScope.$broadcast('focusOn', name);
        }, 500);
    };
});