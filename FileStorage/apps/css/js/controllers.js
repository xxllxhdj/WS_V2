/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {
    app.register.controller('CssCtrl', ['$scope', function ($scope) {
        $scope.data = {
            swiped: false,
            exClass: ''
        };

        $scope.swipe = function () {
            $scope.data.swiped = !$scope.data.swiped;
        };

        $scope.onClick = function (e) {
            if(e.target.className=="btn-close") {
                $scope.data.exClass = "";
            } else {
                $scope.data.exClass = "folded";
            }
        };
    }]);
});