/*global angular*/
angular.module('restClient', ['WebStorageModule']);

angular.module('restClient').config(['OAuthHttpProvider', function(OAuthHttpProvider) {
    OAuthHttpProvider.setServerUrl('http://localhost:3000');
}]);
