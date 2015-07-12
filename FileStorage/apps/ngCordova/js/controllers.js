/**
 * Created by xuxle on 2015/6/19.
 */
define(['app', 'ngCordova'], function (app) {

    app.register.controller('CordovaController', ['$scope', function ($scope) {
    }]);

    app.register.controller('BarcodeScannerCtrl', ['$scope', '$cordovaBarcodeScanner', function ($scope, $cordovaBarcodeScanner) {
        $scope.scan = function () {
            $cordovaBarcodeScanner
                .scan()
                .then(function (result) {
                    $scope.scanResult = result;
                }, function (err) {
                    $scope.scanResult = 'SCAN ERROR (see console)';
                    console.error(err);
                });
        };
    }]);

    app.register.controller('customPluginCtrl', ['$scope', 'extraInfoPlugin', function ($scope, extraInfoPlugin) {
        extraInfoPlugin.get().then(function (extraInfo) {
            $scope.extraInfo = extraInfo;
            $scope.error = false;
        }, function (err) {
            $scope.extraInfo = err;
            $scope.error = true;
        });
    }]);

    app.register.controller('inAppBrowserCtrl', ['$rootScope', '$scope', '$cordovaInAppBrowser', function ($rootScope, $scope, $cordovaInAppBrowser) {
        $scope.url = 'http://www.baidu.com';
        $scope.target = '_blank';

        $scope.openUrl = function () {
            var options = {
                location: "no"
            };
            $cordovaInAppBrowser.open($scope.url, $scope.target, options).then(function () {
                //$cordovaToast.showShortBottom("InAppBrowser opened http://ngcordova.com successfully");
            }, function (error) {
                //$cordovaToast.showShortBottom("Error: " + error);
            });
        };
    }]);

    app.register.controller('fileCtrl', function ($scope, $cordovaFile, APPCONSTANTS, configService) {
        $scope.inputs = {
            configValue: '',
            configFile: APPCONSTANTS.CONFIG_FILE_NAME,
            configResult: configService.get('test')
        };

        $scope.setConfig = function () {
            configService.set('test', $scope.inputs.configValue).then(function () {
                $scope.inputs.configResult = configService.get('test');
            });
        };
    });
});