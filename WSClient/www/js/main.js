
requirejs.config({
    baseUrl: '../www',
    paths: {
        app: 'js/app',
        ionic: 'lib/ionic/js/ionic.bundle',
        ngCordova: 'lib/ngCordova/dist/ng-cordova',
        uiBootstrap: 'lib/bootstrap/ui-bootstrap-tpls',
        appHelp: 'js/appHelp'//,
        //domReady: 'lib/requirejs/domReady'
    },
    shim: {
        ngCordova: {
            deps: ['ionic']
        },
        uiBootstrap: {
            deps: ['ionic']
        }
    }
});

requirejs(['appHelp'], function () {
    // Start the main app logic.
    requirejs(['app'], function () {

        var onDeviceReady = function () {
            angular.bootstrap(document, ['WorkStation']);
        };
        document.addEventListener("deviceready", onDeviceReady, false);
        if (typeof cordova === 'undefined') {
            //require(['domReady!'], function (document) {
            //    onDeviceReady();
            //});
            angular.element(document).ready(function() {
                onDeviceReady();
            });
        }
    });
});