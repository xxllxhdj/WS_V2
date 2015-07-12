/**
 * Created by XXL on 2015/6/20.
 */
define([
    'app',
    appHelp.convertURL('bootstrap/js/controllers.js', true),
    appHelp.convertURL('bootstrap/js/directives.js', true),
    appHelp.convertURL('bootstrap/js/services.js', true),
    appHelp.convertURL('bootstrap/js/filters.js', true)
], function (app) {
    app.register
        .state('app.bootstrap', {
            url: '/bootstrap',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('bootstrap/index.html')
                }
            }
        })
        .state('app.datepicker', {
            url: '/datepicker',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('bootstrap/tpls/datepicker.html'),
                    controller: 'datePickerCtrl'
                }
            }
        });
});