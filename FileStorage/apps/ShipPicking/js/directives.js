
define(['app'], function (app) {
    app.register.directive('getFocus', ['$timeout', function($timeout) {
        return {
            scope: {
                trigger: '@getFocus'
            },
            link: function(scope, element) {
                scope.$watch('trigger', function(newValue, oldValue) {
                    if (newValue === 'false') {
                        return;
                    }
                    var delay = 0;
                    if (newValue === oldValue) {
                        delay = 400;
                    }
                    $timeout(function() {
                        element[0].focus();
                    }, delay);
                });
            }
        }
    }]);
});