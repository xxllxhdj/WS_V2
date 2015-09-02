/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {
    app.register.controller('MapCtrl', ['$scope', function ($scope) {
        var mp = new BMap.Map('map');
        mp.centerAndZoom(new BMap.Point(121.491, 31.233), 11);
    }]);
});