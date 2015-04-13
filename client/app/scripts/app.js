/*global angular, Parse */


angular.module('ForecastDerby', [
    'ngRoute',
    'xeditable',
    'ngStorage',
    'ui.bootstrap',
    'pascalprecht.translate'
]);

angular.module('ForecastDerby').config(['$routeProvider', '$translateProvider', function ($routeProvider, $translateProvider) {
    'use strict';
    $routeProvider.when('/', {
        templateUrl: 'views/default.html',
        controller: 'DefaultCtrl'
    }).otherwise({
        redirectTo: '/'
    });
    
    $translateProvider.useStaticFilesLoader({
      prefix: '/data/',
      suffix: '.json'
    });
    
    $translateProvider.preferredLanguage('en');
    
}]);

angular.module('ForecastDerby').run(['editableOptions', function (editableOptions) {
    'use strict';
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
}]);
