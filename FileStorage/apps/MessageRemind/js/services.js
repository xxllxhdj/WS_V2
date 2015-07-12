/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {
    app.register.factory('MSGCONSTANTS', function () {
        return {
            GetUnReadMessageCmd: 'UFIDA.U9.ISV.MessageRemindSV.IGetUnReadMessageSV',
            GetAllReadMessageNumCmd: 'UFIDA.U9.ISV.MessageRemindSV.IGetAllUnReadMessageCountSV',
            markMessageToReadCmd: 'UFIDA.U9.ISV.MessageRemindSV.IUpdateSingleMessageToReadedSV',
            CSMessage: '个人消息',
            WorkFlowMessage: '审批任务',
            SystemMessage: '系统消息',
            CSTaskRemind: '个人任务',
            CSCalendarRemind: '个人日历',
            DocMsg: '单据留言',
            ConferenceMsg: '会议消息',
            boardMsg: '公告消息',
            CoopTaskMsg: '协同事项',
            FDocMessageNav: '公文消息'
        };
    });

    app.register.factory('MessageService', ['$q', 'SVProxy', 'MSGCONSTANTS', function ($q, SVProxy, MSGCONSTANTS) {
        var o = {},
            unReadMessageNum = [],
            activeMsgs = [];

        o.loadAllUnReadMessageNum = function () {
            var defer = $q.defer();

            SVProxy.callSV({
                name: MSGCONSTANTS.GetAllReadMessageNumCmd,
                params: [],
                onSuccess: function (data) {
                    angular.forEach(data, function (unReadMessage) {
                        unReadMessageNum[unReadMessage.MessageTypeCode] = unReadMessage.UnReadCount;
                    });
                    defer.resolve(unReadMessageNum);
                },
                onFailure: function (err) {
                    defer.reject(err);
                }
            });

            return defer.promise;
        };

        o.getUnReadMessage = function (messageType) {
            var defer = $q.defer();

            SVProxy.callSV({
                name: MSGCONSTANTS.GetUnReadMessageCmd,
                params: [false, messageType],
                onSuccess: function (data) {
                    activeMsgs = data;
                    defer.resolve(data);
                },
                onFailure: function (err) {
                    defer.reject(err);
                }
            });

            return defer.promise;
        };

        o.markMessageToRead = function (msgId) {
            var defer = $q.defer();

            SVProxy.callSV({
                name: MSGCONSTANTS.markMessageToReadCmd,
                params: [true, msgId],
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onFailure: function (err) {
                    defer.reject(err);
                }
            });

            return defer.promise;
        };

        o.getAllUnReadMessageNum = function () {
            return unReadMessageNum;
        };

        o.getActiveMsgProfile = function () {
            var msgProfile = [];
            angular.forEach(activeMsgs, function (activeMsg) {
                msgProfile.push({
                    ID: activeMsg.ID,
                    Title: activeMsg.Title,
                    SenderName: activeMsg.SenderName,
                    SendTime: activeMsg.SendTime
                });
            });
            return msgProfile;
        };

        o.getActiveMsgDetails = function (msgId) {
            var msgDetails = {},
                len = activeMsgs.length,
                msg;
            for(var i = 0; i < len; i++) {
                if (activeMsgs[i].ID.toString() === msgId) {
                    msg = activeMsgs[i];
                    break;
                }
            }
            if (!msg) {
                return msgDetails;
            }
            msgDetails.SenderName = msg.SenderName;
            msgDetails.SendTime = msg.SendTime;
            msgDetails.Title = msg.Title;
            msgDetails.Content = msg.Content;

            return msgDetails;
        };

        return o;
    }]);
});