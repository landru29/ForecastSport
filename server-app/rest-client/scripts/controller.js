/*global angular */
angular.module('restClient').controller('DefaultCtrl', ['$scope', '$http', 'OAuthHttp', 'webStorageService',
    function ($scope, $http, OAuthHttp, webStorageService) {
        "use strict";

        $scope.getMethods = function (lst) {
            var result = [];
            for (var i in lst) {
                result.push({
                    label: lst[i],
                    value: lst[i]
                });
            }
            return result;
        };

        $scope.methods = $scope.getMethods(['GET', 'POST', 'PUT', 'DELETE']);

        // only available if 'grunt rest' is launched
        if (serverData) {
            $scope.resources = [];
            for (var i in serverData.resources) {
                $scope.resources.push({
                    label: serverData.resources[i],
                    value: serverData.resources[i]
                });
            }
        }

        $scope.getResource = function (resName) {
            for (var i in $scope.resources) {
                if ($scope.resources[i].value === resName) {
                    return $scope.resources[i];
                }
            }
            return null;
        };

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
            webStorageService.set('resource', $scope.resourceValue, true);
            webStorageService.set('postData', $scope.postData, true);
            webStorageService.set('headersData', $scope.headersData, true);
            webStorageService.set('getData', $scope.getData, true);
            webStorageService.set('method', $scope.method.value, true);
            webStorageService.set('oauth', $scope.oauth, true);
            webStorageService.set('login', $scope.login, true);
            webStorageService.set('password', $scope.password, true);
        };

        $scope.loadState = function () {
            var postData = webStorageService.get('postData');
            var getData = webStorageService.get('getData');
            var headersData = webStorageService.get('headersData');
            $scope.postData = (postData ? postData : []);
            $scope.getData = (getData ? getData : []);
            $scope.headersData = (headersData ? headersData : []);
            $scope.url = webStorageService.get('url');
            $scope.password = webStorageService.get('password');
            $scope.login = webStorageService.get('login');
            $scope.oauth = (webStorageService.get('oauth') === 'true');

            $scope.resourceValue = webStorageService.get('resource');
            if ($scope.resourceValue) {
                for (var i in $scope.resources) {
                    if ($scope.resources[i].value === $scope.resourceValue) {
                        $scope.resource = $scope.resources[i];
                        break;
                    }
                }
            }
            var method = webStorageService.get('method');
            if (method) {
                for (var n in $scope.methods) {
                    if ($scope.methods[n].value === method) {
                        $scope.method = $scope.methods[n];
                        break;
                    }
                }
            }
        };

        $scope.result = {};

        $scope.loadState();

        $scope.sendRequest = function () {
            $scope.saveState();
            
            $scope.result.status = -1;
            $scope.result.data = null;
            $scope.result.json = '';

            var url = $scope.url.replace(/\/$/, '') + ($scope.resourceValue ? '/' + $scope.resourceValue : '');
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
                data: postData
            };
            
            if (!$scope.oauth) {
                request.headers = headers;
            }
            
            var promise = ($scope.oauth ? OAuthHttp.http(request) : $http(request));

            promise.then(function (resource) {
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
        
        $scope.connect = function(login, password) {
            $scope.loginResult = '';
            OAuthHttp.login(login, password).then(
                function(data){
                    $scope.loginResult = 'Success';
                }, 
                function(err){
                    $scope.loginResult = 'Error !';
                }
            );
        };

        $scope.$watch('resource', function (newVal, oldVal) {
            if ($scope.resourceValue !== newVal.value) {
                $scope.resourceValue = newVal.value;
            }
        });

        $scope.$watch('resourceValue', function (newVal, oldVal) {
            if (oldVal !== newVal) {
                var defaultMethods = $scope.getMethods(['GET', 'POST', 'PUT', 'DELETE']);
                var resObj = $scope.getResource(newVal);
                if ((! resObj) && ($scope.methods.length !== defaultMethods.length)) {
                    $scope.methods = defaultMethods;
                    $scope.method = $scope.methods[0];
                }
                if (resObj) {
                    $scope.methods = $scope.getMethods(serverData.methods[newVal]);
                    $scope.method = $scope.methods[0];
                    $scope.resource = resObj;
                }
                
            }
        });

                }]);