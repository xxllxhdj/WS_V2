/**
 * Created by XXL on 2015/6/20.
 */
define([
    'app',
    'apps/MessageRemind/js/controllers',
    'apps/MessageRemind/js/directives',
    'apps/MessageRemind/js/services',
    'apps/MessageRemind/js/filters'
], function (app) {
    app.register
        .state('app.MessageRemind', {
            url: "/MessageRemind",
            views: {
                'menuContent': {
                    templateUrl: "apps/MessageRemind/index.html",
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
                    templateUrl: "apps/MessageRemind/tpls/message.html",
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
                    templateUrl: "apps/MessageRemind/tpls/details.html",
                    controller: 'DetailsCtrl'
                }
            }
        });
});