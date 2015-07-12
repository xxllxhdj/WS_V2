/**
 * Created by xuxle on 2015/6/26.
 */
define(['ionic'], function () {
    angular.module('WorkStation.services', [])

        .constant('APPCONSTANTS', {
            APP_NAME: 'workstation',
            CONFIG_FILE_NAME: 'config.txt',

            SPLASH_SCREEN_EXTRA_DELAY: 1000,
            PLATFORM_BACK_BUTTON_PRIORITY_VIEW: 110,
            EXIT_APP_CONFIRM_TIME: 2000,

            EXIT_APP_CONFIRM_STR: '再按一次退出工作站',

            DEFAULT_APP_LIST: [{
                id: 'ionic',
                name: 'ionic',
                logo: 'img/ionic.png',
                enabled: true
            }, {
                id: 'ngCordova',
                name: 'ngCordova',
                logo: 'img/ngCordova.png',
                enabled: true
            }, {
                id: 'bootstrap',
                name: 'bootstrap',
                logo: 'img/bootstrap.jpg',
                enabled: true
            }, {
                id: 'ShipPicking',
                name: '条码拣货',
                logo: 'img/ShipPicking.png',
                enabled: true
            }, {
                id: 'MessageRemind',
                name: '消息通知',
                logo: 'img/MessageRemind.png',
                enabled: true
            }]
        })

        .factory('DemoService', ['configService', 'APPCONSTANTS', function (configService, APPCONSTANTS) {
            var demos = [],
                o = {};

            init();

            o.setDemoEnabled = function (id, enabled) {
                for (var i in demos) {
                    if (demos[i].id === id) {
                        demos[i].enabled = enabled;
                        configService.set('demos', demos);
                    }
                }
            };
            o.getDemos = function () {
                return angular.isArray(demos) ? demos.slice(0, demos.length) : [];
            };
            o.getEnabledDemos = function () {
                var enabledDemos = [];
                angular.forEach(demos, function (demo) {
                    if (demo.enabled === true) {
                        enabledDemos.push(demo);
                    }
                });
                return enabledDemos;
            };

            return o;

            function init () {
                demos = configService.get('demos', APPCONSTANTS.DEFAULT_APP_LIST);
            }
        }])

        .factory('utilService', ['APPCONSTANTS', function (APPCONSTANTS) {
            var o = {};

            o.getAppFileDir = function () {
                return cordova.file.externalRootDirectory || cordova.file.documentsDirectory;
            };
            o.getConfigDir = function () {
                return o.getAppFileDir() + '/' + APPCONSTANTS.APP_NAME + '/';
            };

            return o;
        }])

        .factory('configService', ['$q', '$log', '$cordovaFile', 'utilService', 'APPCONSTANTS', function ($q, $log, $cordovaFile, utilService, APPCONSTANTS) {
            var configDefer = $q.defer(),
                config = {},
                o = {
                    loadingPromise: configDefer.promise,
                    set: errorHandler,
                    get: errorHandler
                };

            o.loadingPromise.finally(function () {
                o.set = function (key, value) {
                    var defer = $q.defer();

                    config[key] = value;
                    writeConfigFile().then(function () {
                        defer.resolve();
                    }, function () {
                        defer.reject();
                    });

                    return defer.promise;
                };
                o.get = function (key, defaults) {
                    return config.hasOwnProperty(key) ? config[key] : (defaults || null);
                };
            });

            init();

            return o;

            function errorHandler (err){
                $log.error("Error", err);
            }
            function init () {
                if (window.cordova) {
                    initAppFileDir().then(function () {
                        readConfigFile().then(function (jsonData) {
                            angular.extend(config, jsonData);
                            configDefer.resolve();
                        }, function () {
                            configDefer.resolve();
                        });
                    }, function () {
                        configDefer.resolve();
                    });
                } else {
                    configDefer.resolve();
                }

            }
            function initAppFileDir () {
                var defer = $q.defer(),
                    appFileDir = utilService.getAppFileDir();
                $cordovaFile.checkDir(appFileDir, APPCONSTANTS.APP_NAME).then(function () {
                    defer.resolve();
                }, function () {
                    $cordovaFile.createDir(appFileDir, APPCONSTANTS.APP_NAME, false).finally(function () {
                        defer.resolve();
                    });
                });

                return defer.promise;
            }
            function readConfigFile () {
                var defer = $q.defer(),
                    configFileDir = utilService.getConfigDir();
                $cordovaFile.checkFile(configFileDir, APPCONSTANTS.CONFIG_FILE_NAME).then(function () {
                    $cordovaFile.readAsText(configFileDir, APPCONSTANTS.CONFIG_FILE_NAME).then(function (data) {
                        defer.resolve(angular.fromJson(data));
                    }, function () {
                        defer.resolve({});
                    });
                }, function () {
                    defer.resolve({});
                });

                return defer.promise;
            }
            function writeConfigFile () {
                var defer = $q.defer();

                if (window.cordova) {
                    $cordovaFile.writeFile(utilService.getConfigDir(), APPCONSTANTS.CONFIG_FILE_NAME, angular.toJson(config), true).then(function () {
                        defer.resolve();
                    }, function () {
                        defer.reject();
                    });
                } else {
                    defer.resolve();
                }

                return defer.promise;
            }
        }]);
});