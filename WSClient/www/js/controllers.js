/**
 * Created by xuxle on 2015/6/26.
 */
define(['ionic'], function () {
    angular.module('WorkStation.controllers', [])
        .controller('AppCtrl', ['$scope', '$ionicHistory', '$state', function ($scope, $ionicHistory, $state) {
            $scope.appModel = {
                tabsVisible: false
            };
            $scope.go = function (state) {
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: false,
                    expire: 300
                });
                $state.go(state);
            };

            $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                var url = toState.url;
                if (url.indexOf('demos') != -1 || url.indexOf('about') != -1 || url.indexOf('option') != -1) {
                    $scope.appModel.tabsVisible = false;
                } else {
                    $scope.appModel.tabsVisible = true;
                }
            });
        }])

        .controller('DemosCtrl', ['$scope', '$rootScope', '$state', 'routeResolver', 'DemoService', function ($scope, $rootScope, $state, routeResolver, DemoService) {
            $scope.techData = DemoService.getEnabledDemos();

            $scope.goApp = function (appId) {
                routeResolver.load(appId).then(function () {
                    $state.go('app.' + appId);
                }, function () {
                    alert('加载Demo失败，请确认是否已安装然后重试。');
                });
            };

            $rootScope.$on('DemoEnabledChanged', function () {
                $scope.techData = DemoService.getEnabledDemos();
            });
        }])

        .controller('OptionCtrl', ['$scope', '$rootScope', 'DemoService', function ($scope, $rootScope, DemoService) {
            $scope.data = {
                demos: DemoService.getDemos()
            };

            $scope.setDemoEnabled = function (id, enabled) {
                DemoService.setDemoEnabled(id, enabled);
                $rootScope.$emit('DemoEnabledChanged');
            };
        }]);
});