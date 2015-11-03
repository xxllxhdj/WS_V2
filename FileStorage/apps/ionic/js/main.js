
define([
    'app',
    appHelp.convertURL('ionic/js/controllers.js', true),
    appHelp.convertURL('ionic/js/directives.js', true),
    appHelp.convertURL('ionic/js/services.js', true),
    appHelp.convertURL('ionic/js/filters.js', true),
    appHelp.convertURL('ionic/lib/pinyin.js', true)
], function (app) {
    app.register
        .state('app.ionic', {
            url: '/ionic',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('ionic/index.html')
                }
            }
        })
        .state('app.expander', {
            url: '/expander',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('ionic/tpls/expander.html'),
                    controller: 'ExpandCtrl'
                }
            }
        })
        .state('app.scroll', {
            url: '/scroll',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('ionic/tpls/scroll.html'),
                    controller: 'ScrollCtrl'
                }
            }
        })
        .state('app.slideBox', {
            url: '/slideBox',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('ionic/tpls/slideBox.html')
                }
            }
        })
        .state('app.combobox', {
            url: '/combobox',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('ionic/tpls/combobox.html'),
                    controller: 'ComboCtrl'
                }
            }
        })
        .state('app.hugedata', {
            url: '/hugedata',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL('ionic/tpls/hugeData.html'),
                    controller: 'HugeDataCtrl'
                }
            }
        });
    console.log(pinyin.getCamelChars('测试'));
});