/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {
    app.register.controller('MapCtrl', ['$scope', function ($scope) {
        var mp = new BMap.Map('map');
        mp.centerAndZoom(new BMap.Point(116.404, 39.915), 15);
        //mp.centerAndZoom("北京",15);
        //mp.addControl(new BMap.MapTypeControl());
        //mp.enableScrollWheelZoom(true);
        var marker = new BMap.Marker(new BMap.Point(116.404, 39.915));
        mp.addOverlay(marker);
        //marker.setAnimation(BMAP_ANIMATION_BOUNCE);

        var opts = {
            width : 200,
            height: 100,
            title : "海底捞王府井店" ,
            enableMessage:true,
            message:"亲耐滴，晚上一起吃个饭吧？戳下面的链接看下地址喔~"
        };
        var infoWindow = new BMap.InfoWindow("地址：北京市东城区王府井大街88号乐天银泰百货八层", opts);
        marker.addEventListener("click", function(){
            mp.openInfoWindow(infoWindow, new BMap.Point(116.404, 39.915));
        });

        var pt = new BMap.Point(116.417, 39.909);
        var myIcon = new BMap.Icon("img/photo.png", new BMap.Size(40, 40));
        var marker2 = new BMap.Marker(pt,{icon:myIcon});
        mp.addOverlay(marker2);
        marker2.enableDragging();
    }]);
});