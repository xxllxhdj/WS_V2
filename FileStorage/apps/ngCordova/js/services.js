/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {
    app.register.factory('extraInfoPlugin', ['$q', function ($q) {
        return {
            get: function () {
                var q = $q.defer();

                if (window.cordova && window.cordova.plugins.extraInfo) {
                    cordova.plugins.extraInfo.getExtra(function (result) {
                        q.resolve(result);
                    }, function (err) {
                        q.reject(err);
                    });
                } else {
                    q.reject('请安装extraInfo插件');
                }

                return q.promise;
            }
        };
    }]);
});