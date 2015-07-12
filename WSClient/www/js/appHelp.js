
(function () {
    var appHelp = window.appHelp || (window.appHelp = {});

    appHelp.convertURL = function (srcURL, require) {
        var childAppRootDir = '../../';
        if (!require) {
            childAppRootDir += 'FileStorage/apps/';
        }
        if (window.cordova && cordova.file) {
            childAppRootDir = (cordova.file.externalDataDirectory || cordova.file.documentsDirectory) + 'apps/'
        }
        //alert(childAppRootDir + srcURL);
        return childAppRootDir + srcURL;
    };
})();