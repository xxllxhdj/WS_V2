/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {

    app.register.factory('ionicCombobox', [
        '$rootScope',
        '$compile',
        '$animate',
        '$timeout',
        '$ionicTemplateLoader',
        '$ionicPlatform',
        '$ionicBody',
        'IONIC_BACK_PRIORITY',
        function($rootScope, $compile, $animate, $timeout, $ionicTemplateLoader, $ionicPlatform, $ionicBody, IONIC_BACK_PRIORITY) {

            return {
                show: actionSheet
            };
            
            function actionSheet(opts) {
                var scope = $rootScope.$new(true);

                angular.extend(scope, {
                    cancel: angular.noop,
                    destructiveButtonClicked: angular.noop,
                    buttonClicked: angular.noop,
                    $deregisterBackButton: angular.noop,
                    buttons: [],
                    cancelOnStateChange: true
                }, opts || {});

                function textForIcon(text) {
                    if (text && /icon/.test(text)) {
                        scope.$actionSheetHasIcon = true;
                    }
                }

                for (var x = 0; x < scope.buttons.length; x++) {
                    textForIcon(scope.buttons[x].text);
                }
                textForIcon(scope.cancelText);
                textForIcon(scope.destructiveText);

                // Compile the template
                var element = scope.element = $compile('<ion-combobox ng-class="cssClass" buttons="buttons"></ion-combobox>')(scope);

                // Grab the sheet element for animation
                var sheetEl = angular.element(element[0].querySelector('.action-sheet-wrapper'));

                var stateChangeListenDone = scope.cancelOnStateChange ?
                    $rootScope.$on('$stateChangeSuccess', function() { scope.cancel(); }) :
                    angular.noop;

                // removes the actionSheet from the screen
                scope.removeSheet = function(done) {
                    if (scope.removed) return;

                    scope.removed = true;
                    sheetEl.removeClass('action-sheet-up');
                    $timeout(function() {
                        // wait to remove this due to a 300ms delay native
                        // click which would trigging whatever was underneath this
                        $ionicBody.removeClass('action-sheet-open');
                    }, 400);
                    scope.$deregisterBackButton();
                    stateChangeListenDone();

                    $animate.removeClass(element, 'active').then(function() {
                        scope.$destroy();
                        element.remove();
                        // scope.cancel.$scope is defined near the bottom
                        scope.cancel.$scope = sheetEl = null;
                        (done || angular.noop)();
                    });
                };

                scope.showSheet = function(done) {
                    if (scope.removed) return;

                    $ionicBody.append(element)
                        .addClass('action-sheet-open');

                    $animate.addClass(element, 'active').then(function() {
                        if (scope.removed) return;
                        (done || angular.noop)();
                    });
                    $timeout(function() {
                        if (scope.removed) return;
                        sheetEl.addClass('action-sheet-up');
                    }, 20, false);
                };

                // registerBackButtonAction returns a callback to deregister the action
                scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(
                    function() {
                        $timeout(scope.cancel);
                    },
                    IONIC_BACK_PRIORITY.actionSheet
                );

                // called when the user presses the cancel button
                scope.cancel = function() {
                    // after the animation is out, call the cancel callback
                    scope.removeSheet(opts.cancel);
                };

                scope.buttonClicked = function(index) {
                    // Check if the button click event returned true, which means
                    // we can close the action sheet
                    if (opts.buttonClicked(index, opts.buttons[index]) === true) {
                        scope.removeSheet();
                    }
                };

                scope.destructiveButtonClicked = function() {
                    // Check if the destructive button click event returned true, which means
                    // we can close the action sheet
                    if (opts.destructiveButtonClicked() === true) {
                        scope.removeSheet();
                    }
                };

                scope.showSheet();

                // Expose the scope on $ionicActionSheet's return value for the sake
                // of testing it.
                scope.cancel.$scope = scope;

                return scope.cancel;
            }
        }]);

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