/**
 * Created by xuxle on 2015/6/19.
 */
define(['app', 'ngCordova'], function (app) {

    app.register.controller('datePickerCtrl', ['$scope', function ($scope) {
        $scope.data = {
            date: ''
        };
    }]);

});