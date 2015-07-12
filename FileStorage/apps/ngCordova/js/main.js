/**
 * Created by XXL on 2015/6/20.
 */
define([
    'app',
    appHelp.convertURL('ngCordova/js/controllers.js', true),
    appHelp.convertURL('ngCordova/js/directives.js', true),
    appHelp.convertURL('ngCordova/js/services.js', true),
    appHelp.convertURL('ngCordova/js/filters.js', true)
], function (app) {
    app.register
        .state('app.ngCordova', {
            url: "/ngCordova",
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL("ngCordova/index.html"),
                    controller: 'CordovaController'
                }
            }
        })
        .state('app.barcodeScanner', {
            url: "/barcodeScanner",
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL("ngCordova/tpls/barcodeScanner.html"),
                    controller: "BarcodeScannerCtrl"
                }
            }
        })
        .state('app.customPlugins', {
            url: "/customPlugins",
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL("ngCordova/tpls/customPlugins.html"),
                    controller: "customPluginCtrl"
                }
            }
        })
        .state('app.inAppBrowser', {
            url: "/inAppBrowser",
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL("ngCordova/tpls/inAppBrowser.html"),
                    controller: "inAppBrowserCtrl"
                }
            }
        })
        .state('app.file', {
            url: "/file",
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL("ngCordova/tpls/file.html"),
                    controller: "fileCtrl"
                }
            }
        });
});