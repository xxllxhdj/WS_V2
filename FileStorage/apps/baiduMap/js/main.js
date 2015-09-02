/**
 * Created by XXL on 2015/6/20.
 */
define([
    'app',
    appHelp.convertURL('baiduMap/js/controllers.js', true),
    appHelp.convertURL('baiduMap/js/directives.js', true),
    appHelp.convertURL('baiduMap/js/services.js', true),
    appHelp.convertURL('baiduMap/js/filters.js', true)
], function (app) {
    app.register
        .state('app.baiduMap', {
            url: '/baiduMap',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('baiduMap/index.html')
                }
            }
        })
        .state('app.helloworld', {
            url: '/helloworld',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('baiduMap/tpls/helloworld.html'),
                    controller: 'MapCtrl'
                }
            }
        });
});