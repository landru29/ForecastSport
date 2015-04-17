/*global angular */
angular.module('ForecastDerby').controller('MenuCtrl', ['$scope', '$rootScope', '$localStorage', '$translate', '$modal', '$location', '$window', 'OAuthHttp', function ($scope, $rootScope, $localStorage, $translate, $modal, $location, $window, OAuthHttp) {
    "use strict";

    $scope.menuConfig = [
        {
            caption: 'Backoffice',
            action: 'backoffice',
            class: 'toolbox-icon',
            roles: ['admin']
        }
    ];

    $scope.getMenu = function (role) {
        var menu = [];
        for (var i in $scope.menuConfig) {
            if ($scope.menuConfig[i].roles.indexOf(role) > -1) {
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
        OAuthHttp.logout().then(
            function () {
                $rootScope.$broadcast('menu-reload', {});
            }
        );
    };

    $scope.isConnected = function () {
        return ($scope.user !== null);
    };

    var lang = $localStorage.language;
    $scope.changeLang((!lang) ? (navigator.language || navigator.userLanguage) : lang);

    $scope.getRoles = function () {
        OAuthHttp.whoAmI().then(
            function (user) {
                $scope.user = user;
                $scope.menu = $scope.getMenu(user.role);
            },
            function (err) {
                $scope.user = null;
                $scope.menu = $scope.getMenu('anonymous');
            }
        );
    };
    $scope.$on('menu-reload', function (event, args) {
        $scope.getRoles();
    });

    $scope.open = function (url) {
        $window.open(url, '_blank');
    };


    $scope.getRoles();
    $scope.user = null;

}]);