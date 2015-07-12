/**
 * Created by xuxle on 2015/6/19.
 */
define(['app', 'ngCordova'], function (app) {

    app.register.controller('ExpandCtrl', ['$scope', 'performanceService', function ($scope, performanceService) {
        $scope.data = {
            expanded: true,
            current: performanceService.getUserPerf(),
            performances: performanceService.getAllPerfs()
        };

        $scope.resetPref = function (userId) {
            $scope.data.current = performanceService.getUserPerf(userId);
        };
    }]);

    app.register.controller('ScrollCtrl', ['$scope', function ($scope) {
        $scope.data = {
            scrollImg : appHelp.convertURL('ionic/img/Desert.gif')
        };
    }]);

});