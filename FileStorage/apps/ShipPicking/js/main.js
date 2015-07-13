
define([
    'app',
    appHelp.convertURL('ShipPicking/js/controllers.js', true),
    appHelp.convertURL('ShipPicking/js/directives.js', true),
    appHelp.convertURL('ShipPicking/js/services.js', true),
    appHelp.convertURL('ShipPicking/js/filters.js', true)
], function (app) {
    app.register
        .state('app.ShipPicking', {
            url: '/ShipPicking',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL("ShipPicking/index.html"),
                    controller: 'PicksCtrl',
                    resolve: {
                        'loadPicks': ['ShipPickService', function (ShipPickService) {
                            return ShipPickService.getShipLineInfo(0);
                        }]
                    }
                }
            }
        })
        .state('app.pick', {
            url: '/picks/:docId',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL("ShipPicking/tpls/pick.html"),
                    controller: 'ShipLinesCtrl',
                    resolve: {
                        'loadPicks': ['$stateParams', 'ShipPickService', function ($stateParams, ShipPickService) {
                            return ShipPickService.getShipLineInfo($stateParams.docId);
                        }]
                    }
                }
            }
        });
});