/*global angular, Parse */


angular.module('ForecastDerby', [
    'ngRoute',
    'xeditable',
    'ngStorage',
    'ui.bootstrap',
    'pascalprecht.translate',
    'ClientGruntConfiguration'
]);

angular.module('ForecastDerby').config(['$routeProvider', '$translateProvider', 'OAuthHttpProvider', 'apiUrl', function ($routeProvider, $translateProvider, OAuthHttpProvider, apiUrl) {
    'use strict';
    $routeProvider.when('/', {
        templateUrl: 'views/default.html',
        controller: 'DefaultCtrl'
    }).when('/reset-password/login/:login/token/:token', {
        templateUrl: 'views/reset-password.html',
        controller: 'ResetPasswordCtrl'
    }).otherwise({
        redirectTo: '/'
    });
    
    $translateProvider.useStaticFilesLoader({
      prefix: '/data/',
      suffix: '.json'
    });
    
    $translateProvider.preferredLanguage('en');
    
    OAuthHttpProvider.setServerUrl((apiUrl ? apiUrl : window.location.origin));
    
}]);

angular.module('ForecastDerby').run(['editableOptions', function (editableOptions) {
    'use strict';
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);
