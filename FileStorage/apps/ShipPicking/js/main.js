
define([
    'app',
    'apps/ShipPicking/js/controllers',
    'apps/ShipPicking/js/directives',
    'apps/ShipPicking/js/services',
    'apps/ShipPicking/js/filters'
], function (app) {
    app.register
        .state('app.ShipPicking', {
            url: '/ShipPicking',
            views: {
                'menuContent': {
                    templateUrl: "apps/ShipPicking/index.html",
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
                    templateUrl: "apps/ShipPicking/tpls/pick.html",
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