/**
 * Created by XXL on 2015/6/20.
 */
define([
    'app',
    appHelp.convertURL('MessageRemind/js/controllers.js', true),
    appHelp.convertURL('MessageRemind/js/directives.js', true),
    appHelp.convertURL('MessageRemind/js/services.js', true),
    appHelp.convertURL('MessageRemind/js/filters.js', true)
], function (app) {
    app.register
        .state('app.MessageRemind', {
            url: "/MessageRemind",
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL("MessageRemind/index.html"),
                    controller: 'MessagesCtrl',
                    resolve: {
                        'loadMsgs': ['MessageService', function (MessageService) {
                            return MessageService.loadAllUnReadMessageNum();
                        }]
                    }
                }
            }
        })
        .state('app.message', {
            url: "/messages/:msgType",
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL("MessageRemind/tpls/message.html"),
                    controller: 'MessageCtrl',
                    resolve: {
                        'loadAcvtiveMsgs': ['$stateParams', 'MessageService', function ($stateParams, MessageService) {
                            return MessageService.getUnReadMessage($stateParams.msgType);
                        }]
                    }
                }
            }
        })
        .state('app.message-details', {
            url: '/messages/:msgType/:msgId',
            views: {
                'menuContent': {
                    templateUrl: appHelp.convertURL("MessageRemind/tpls/details.html"),
                    controller: 'DetailsCtrl'
                }
            }
        });
});