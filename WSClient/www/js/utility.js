/**
 * Created by xuxle on 2015/6/26.
 */
define(['ionic'], function () {
    angular.module('WorkStation.utility', [])
        .factory('SVProxy', function () {
            var o = {};

            o.callSV = function (jsonData) {
                var svFullName = jsonData['name'],
                    params = jsonData['params'],
                    url = 'http://139.217.3.133:120/svc_script/' + '?n=' + svFullName + '&p=null';
                return require([url], function(bpObj) {
                    var svcProxy;
                    params.unshift({
                        CultureName: "zh-CN",
                        EntCode: "001",
                        OrgCode: "001",
                        UserCode: "demo"
                    });
                    if (jsonData['onSuccess']) {
                        _onSuccess = jsonData['onSuccess'];
                        params.push(jsonData['onSuccess']);
                    }
                    if (jsonData['onFailure']) {
                        _onFailure = jsonData['onFailure'];
                        params.push(jsonData['onFailure']);
                    }

                    svcProxy = 'http://139.217.3.133:120/u9_gateway/' + 'RestServices/' + svFullName + '.svc';
                    bpObj.set_path(svcProxy);
                    return bpObj.Do.apply(bpObj, params);
                }, function () {
                    alert('请求bpObj失败！');
                });
            };

            return o;
        })
        .factory('routeResolver', ['$rootScope', '$q', function ($rootScope, $q) {

            return {
                resolve: resolve,
                load: load
            };

            function resolve (appName, homeHtml, homeCtrl, controllerAs, secure) {
                var routeDef = {};
                routeDef.templateUrl = appHelp.convertURL(appName + '/' + homeHtml);
                if (homeCtrl) {
                    routeDef.controller = homeCtrl;
                }
                if (controllerAs) {
                    routeDef.controllerAs = controllerAs;
                }
                routeDef.secure = (secure) ? secure : false;
                routeDef.resolve = {
                    load: function () {
                        var jsDir = appHelp.convertURL(appName);
                        var dependencies = [
                            jsDir + '/js/main.js'
                        ];

                        var defer = $q.defer();

                        require(dependencies, function () {
                            defer.resolve();
                            //$rootScope.$apply();
                        });

                        return defer.promise;
                    }
                };
                return routeDef;
            }

            function load (appId) {
                var defer = $q.defer();

                var jsDir = appHelp.convertURL(appId);
                var dependencies = [
                    jsDir + '/js/main.js'
                ];

                require(dependencies, function () {
                    if (!checkCSSLoaded(appId)) {
                        loadCSS(jsDir + '/css/main.css');
                    }
                    defer.resolve();
                    //$rootScope.$apply();
                }, function () {
                    defer.reject();
                });

                return defer.promise;
            }

            function loadCSS (path) {
                var head = document.getElementsByTagName('head')[0];
                var link = document.createElement('link');
                link.href = path;
                link.rel = 'stylesheet';
                link.type = 'text/css';
                head.appendChild(link);
            }

            function checkCSSLoaded (appId) {
                var loadedCSS = csss(),
                    len = loadedCSS.length,
                    path = appId + '/css/main.css';
                for (var i = 0; i < len; i++) {
                    if (loadedCSS[i].href.indexOf(path) != -1) {
                        return true;
                    }
                }
                return false;
            }

            function csss() {
                return document.getElementsByTagName('link');
            }
        }]);
});