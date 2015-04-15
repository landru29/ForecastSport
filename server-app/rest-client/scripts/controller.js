/*global angular */
angular.module('restClient').controller('DefaultCtrl', ['$scope', '$http', 'webStorageService',
    function ($scope, $http, webStorageService) {
        "use strict";

        $scope.methods = [
            {
                label: 'GET',
                value: 'GET'
            },
            {
                label: 'POST',
                value: 'POST'
            },
            {
                label: 'PUT',
                value: 'PUT'
            },
            {
                label: 'DELETE',
                value: 'DELETE'
            }
        ];

        $scope.postData = [];
        $scope.getData = [];

        $scope.method = $scope.methods[0];

        $scope.addField = function (list) {
            list.push({
                label: '',
                value: ''
            });
        };

        $scope.remove = function (list, element) {
            list.splice(list.indexOf(element), 1);
        };

        $scope.saveState = function () {
            webStorageService.set('url', $scope.url.replace(/\/$/, ''), true);
            webStorageService.set('resource', $scope.resource, true);
            webStorageService.set('postData', $scope.postData, true);
            webStorageService.set('headersData', $scope.headersData, true);
            webStorageService.set('getData', $scope.getData, true);
            webStorageService.set('method', $scope.method.value, true);
        };

        $scope.loadState = function () {
            var postData = webStorageService.get('postData');
            var getData = webStorageService.get('getData');
            var headersData = webStorageService.get('headersData');
            $scope.postData = (postData ? postData : []);
            $scope.getData = (getData ? getData : []);
            $scope.headersData = (headersData ? headersData : []);
            $scope.url = webStorageService.get('url');
            $scope.resource = webStorageService.get('resource');
            var method = webStorageService.get('method');
            if (method) {
                for (var i in $scope.methods) {
                    if ($scope.methods[i].value === method) {
                        $scope.method = $scope.methods[i];
                        break;
                    }
                }
            }
        };

        $scope.result = {};

        $scope.loadState();

        $scope.sendRequest = function () {
            $scope.saveState();

            var url = $scope.url.replace(/\/$/, '') + ($scope.resource ? '/' + $scope.resource : '');
            var getParam = [];
            for (var i in $scope.getData) {
                getParam.push(encodeURIComponent($scope.getData[i].label) + '=' + encodeURIComponent($scope.getData[i].value));
            }
            url += (getParam.length ? '?' + getParam.join('&') : '');
            var postData = {};
            for (var n in $scope.postData) {
                postData[$scope.postData[n].label] = $scope.postData[n].value;
            }
            
            var headers = {};
            for (var t in $scope.headersData) {
                headers[$scope.headersData[t].label] = $scope.headersData[t].value;
            }

            var request = {
                url: url,
                method: $scope.method.value,
                data: postData,
                headers: headers
            };

            $http(request).then(function (resource) {
                $scope.result.status = resource.status;
                $scope.result.data = resource.data;
                $scope.result.json = JSON.stringify(resource.data, null, 4);
            }, function (error) {
                $scope.result.error = error;
                $scope.result.status = error.status;
                $scope.result.json = 'An error occured; see console ' + "\n\n" + error.statusText + "\n" + JSON.stringify(error.data, null, 4);
                console.log(error);
            });


        };

}]);