/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {
    app.register.factory('performanceService', function () {
        var performances = [{
            id: 600001,
            name: 'Frank',
            photo: 'img/ionic.png',
            num: 528800000,
            trend: 1
        }, {
            id: 600002,
            name: 'Emma',
            photo: 'img/ionic.png',
            num: 508800000,
            trend: 0
        }, {
            id: 600003,
            name: 'Tom',
            photo: 'img/ionic.png',
            num: 488800000,
            trend: -1
        }, {
            id: 600004,
            name: 'Lucy',
            photo: 'img/ionic.png',
            num: 478800000,
            trend: 1
        }, {
            id: 600005,
            name: 'Tommy',
            photo: 'img/ionic.png',
            num: 408800000,
            trend: 0
        }, {
            id: 600006,
            name: 'Jerry',
            photo: 'img/ionic.png',
            num: 398800000,
            trend: 1
        }, {
            id: 600007,
            name: 'Janet',
            photo: 'img/ionic.png',
            num: 378800000,
            trend: 1
        }, {
            id: 600008,
            name: 'Den',
            photo: 'img/ionic.png',
            num: 348800000,
            trend: -1
        }, {
            id: 600009,
            name: 'Jack',
            photo: 'img/ionic.png',
            num: 328800000,
            trend: -1
        }, {
            id: 600010,
            name: 'Query',
            photo: 'img/ionic.png',
            num: 318800000,
            trend: 1
        }, {
            id: 600011,
            name: 'Senny',
            photo: 'img/ionic.png',
            num: 288800000,
            trend: 0
        }, {
            id: 600012,
            name: 'Tony',
            photo: 'img/ionic.png',
            num: 268800000,
            trend: 1
        }, {
            id: 600013,
            name: 'Franks',
            photo: 'img/ionic.png',
            num: 248800000,
            trend: -1
        }, {
            id: 600014,
            name: 'Franky',
            photo: 'img/ionic.png',
            num: 238800000,
            trend: 1
        }, {
            id: 600015,
            name: 'Franko',
            photo: 'img/ionic.png',
            num: 158800000,
            trend: 1
        }];

        var curUserId = 600012;
        var o = {};

        o.getAllPerfs = function () {
            return performances.slice(0, performances.length);
        };
        o.getUserPerf = function (userId) {
            userId = userId ? userId : curUserId;
            var len = performances.length;
            for (var i = 0; i < len; i++) {
                if (performances[i].id === userId) {
                    return {
                        name: performances[i].name,
                        photo: performances[i].photo,
                        num: performances[i].num,
                        trend: performances[i].trend,
                        rank: i + 1,
                        fight: parseInt((len - i - 1) * 100 / (len - 1))
                    };
                }
            }
        };

        return o;
    });
});