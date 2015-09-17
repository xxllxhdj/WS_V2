/**
 * Created by XXL on 2015/6/20.
 */
define([
    'app',
    appHelp.convertURL('css/js/controllers.js', true),
    appHelp.convertURL('css/js/directives.js', true),
    appHelp.convertURL('css/js/services.js', true),
    appHelp.convertURL('css/js/filters.js', true)
], function (app) {
    app.register
        .state('app.css', {
            url: '/css',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('css/index.html')
                }
            }
        })
        .state('app.border', {
            url: '/border',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('css/tpls/border.html')
                }
            }
        });
});