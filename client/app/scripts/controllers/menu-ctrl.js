/*global angular */
angular.module('ForecastDerby').controller('MenuCtrl', ['$scope', '$rootScope', '$localStorage', '$translate', '$modal',  '$location', '$window', function ($scope, $rootScope, $localStorage, $translate, $modal, $location, $window) {
    "use strict";

    $scope.menuConfig = [
        {
            caption: 'Backoffice',
            action: 'backoffice',
            class: 'toolbox-icon',
            role: 'admin'
        }
    ];
    $scope.getMenu = function (roles) {
        var menu = [];
        for (var i in $scope.menuConfig) {
            if (roles.indexOf($scope.menuConfig[i].role) > -1) {
                menu.push($scope.menuConfig[i]);
            }
        }
        return menu;
    };
    $scope.menu = [];

    $scope.triggerAction = function (action, params) {
        $location.path('/' + action + (params ? '/' + params : ''));
    };

    $scope.changeLang = function (lang) {
        $translate.use(lang);
        $localStorage.language = lang;
    };

    $scope.connect = function () {
        var modalInstance = $modal.open({
            templateUrl: 'views/modal-connect.html',
            controller: 'ModalConnectCtrl',
            size: '',
            resolve: {}
        });
    };

    $scope.disconnect = function () {

    };

    $scope.isConnected = function () {
        return false;
    };

    var lang = $localStorage.language;
    $scope.changeLang((!lang) ? (navigator.language || navigator.userLanguage) : lang);

    $scope.getRoles = function () {
        $rootScope.$broadcast('role', ['guest']);
    };
    $scope.$on('menu-reload', function (event, args) {
        $scope.getRoles();
    });
    
    $scope.open = function(url) {
        $window.open(url, '_blank');
    };
    
    
    $scope.getRoles();

}]);
