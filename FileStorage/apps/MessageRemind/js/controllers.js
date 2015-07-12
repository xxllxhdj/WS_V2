/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {

    app.register.controller('MessagesCtrl', ['$scope', 'MessageService', 'MSGCONSTANTS', function ($scope, MessageService, MSGCONSTANTS) {
        $scope.headerUnReadMessages = [{
            name: MSGCONSTANTS.CSMessage,
            msgType: 'CSMessage',
            msgNum: '',
            img: '../apps/MessageRemind/image/MyMessage.png'
        }, {
            name: MSGCONSTANTS.WorkFlowMessage,
            msgType: 'WorkFlowMessage',
            msgNum: '',
            img: '../apps/MessageRemind/image/ApprovalTask.png'
        }, {
            name: MSGCONSTANTS.SystemMessage,
            msgType: 'SystemMessage',
            msgNum: '',
            img: '../apps/MessageRemind/image/SystemMessage.png'
        }];
        $scope.contentUnReadMessages = [{
            name: MSGCONSTANTS.CSTaskRemind,
            msgType: 'CSTaskRemind',
            msgNum: ''
        }, {
            name: MSGCONSTANTS.CSCalendarRemind,
            msgType: 'CSCalendarRemind',
            msgNum: ''
        }, {
            name: MSGCONSTANTS.DocMsg,
            msgType: 'DocMsg',
            msgNum: ''
        }, {
            name: MSGCONSTANTS.ConferenceMsg,
            msgType: 'ConferenceMsg',
            msgNum: ''
        }, {
            name: MSGCONSTANTS.boardMsg,
            msgType: 'boardMsg',
            msgNum: ''
        }, {
            name: MSGCONSTANTS.CoopTaskMsg,
            msgType: 'CoopTaskMsg',
            msgNum: ''
        }, {
            name: MSGCONSTANTS.FDocMessageNav,
            msgType: 'FDocMessageNav',
            msgNum: ''
        }];

        init();

        function init () {
            var unReadMessages = MessageService.getAllUnReadMessageNum();
            angular.forEach($scope.headerUnReadMessages, function (headerUnReadMessage) {
                var msgCount = unReadMessages[headerUnReadMessage.msgType];
                headerUnReadMessage.msgNum = msgCount <= 0 ? '' : msgCount;
            });
            angular.forEach($scope.contentUnReadMessages, function (contentUnReadMessage) {
                var msgCount = unReadMessages[contentUnReadMessage.msgType];
                contentUnReadMessage.msgNum = msgCount <= 0 ? '' : msgCount;
            });
        }
    }]);

    app.register.controller('MessageCtrl', ['$scope', '$stateParams', 'MessageService', 'MSGCONSTANTS', function ($scope, $stateParams, MessageService, MSGCONSTANTS) {
        $scope.msgType = $stateParams.msgType;
        $scope.name = MSGCONSTANTS[$stateParams.msgType];
        $scope.totalcount = 0;
        $scope.messageData = [];
        $scope.numberOfItemsToDisplay = 10;
        $scope.noMoreItemsAvailable = false;

        $scope.loadMore = function () {
            if ($scope.messageData && $scope.messageData.length != 0) {
                if ($scope.messageData.length > $scope.numberOfItemsToDisplay) {
                    $scope.numberOfItemsToDisplay += 10;
                } else {
                    $scope.noMoreItemsAvailable = true;
                }
            } else {
                $scope.noMoreItemsAvailable = true;
            }
            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        init();

        function init () {
            $scope.messageData = MessageService.getActiveMsgProfile();
            $scope.totalcount = $scope.messageData.length;
            $scope.noMoreItemsAvailable = false;
        }
    }]);

    app.register.controller('DetailsCtrl', ['$scope', '$stateParams', '$ionicNavBarDelegate', 'MessageService', 'MSGCONSTANTS', function ($scope, $stateParams, $ionicNavBarDelegate, MessageService, MSGCONSTANTS) {
        $scope.msgType = $stateParams.msgType;
        $scope.msgId = $stateParams.msgId;

        $scope.name = MSGCONSTANTS[$stateParams.msgType];
        $scope.msgDetails = MessageService.getActiveMsgDetails($stateParams.msgId);

        $scope.markMsgToRead = function () {
            MessageService.markMessageToRead($scope.msgId).then(function (data) {
                $ionicNavBarDelegate.back();
            }, function (er) {
                console.log('Failed to markMsgToRead');
            });
        };
    }]);
});