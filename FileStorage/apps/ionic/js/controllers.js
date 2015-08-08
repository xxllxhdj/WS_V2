/**
 * Created by xuxle on 2015/6/19.
 */
define(['app', 'ngCordova'], function (app) {

    app.register.controller('ExpandCtrl', ['$scope', '$timeout', 'performanceService', function ($scope, $timeout, performanceService) {
        $scope.data = {
            expanded: true,
            current: performanceService.getUserPerf(),
            performances: performanceService.getAllPerfs(),
            scrollHeight: ''
        };

        $scope.resetPref = function (userId) {
            $scope.data.current = performanceService.getUserPerf(userId);
        };

        $scope.$watch('data.expanded', function (value) {
            var delay = value ? 350 : 0;
            $timeout(function () {
                update(value);
            }, delay);
        });

        function update (itemExpanded) {
            var expandHeight = itemExpanded ? 145 : 20,
                navBarHeight = 44,
                tabsHeight = 48,
                docHeight = document.body.scrollHeight;
            $scope.data.scrollHeight = {height: + (docHeight - expandHeight - navBarHeight - tabsHeight) + 'px'};
        }
    }]);

    app.register.controller('ScrollCtrl', ['$scope', function ($scope) {
        $scope.data = {
            scrollImg : appHelp.convertURL('ionic/img/Desert.gif')
        };

        $scope.rate = 7;
        $scope.max = 10;
        $scope.isReadonly = false;
        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.onDropDownMenu = function () {

        };
    }]);

    app.register.controller('ComboCtrl', ['$scope', 'ionicCombobox', function ($scope, ionicCombobox) {
        $scope.showActionSheet = function () {
            ionicCombobox.show({
                data: [{
                    id: '001',
                    name: '测试1'
                }, {
                    id: '002',
                    name: '测试2'
                }, {
                    id: '003',
                    name: '测试3'
                }, {
                    id: '004',
                    name: '测试4'
                }, {
                    id: '005',
                    name: '测试5'
                }, {
                    id: '006',
                    name: '测试6'
                }, {
                    id: '007',
                    name: '测试7'
                }],
                displayField: 'name',
                valueField: 'id',
                buttonClicked: function (index) {
                    return true;
                }
            });
        };
    }]);

});