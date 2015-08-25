/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {

    app.register.factory('wsPopup', [
        '$ionicTemplateLoader',
        '$q',
        '$timeout',
        '$rootScope',
        '$ionicBody',
        '$compile',
        '$ionicPlatform',
        'IONIC_BACK_PRIORITY',
        function($ionicTemplateLoader, $q, $timeout, $rootScope, $ionicBody, $compile, $ionicPlatform, IONIC_BACK_PRIORITY) {

            var config = {
                stackPushDelay: 75
            };
            var POPUP_TPL =
                '<div class="popup-container ws-popup-container" ng-class="cssClass">' +
                    '<div class="popup ws-popup">' +
                        '<div class="popup-body">' +
                        '</div>' +
                        '<i class="icon ion-ios-close-empty icon-close-right" ng-if="dismissable" ng-click="buttonTapped($event)"></i>' +
                    '</div>' +
                '</div>';
            var popupStack = [];

            var wsPopup = {
                show: showPopup,

                _createPopup: createPopup,
                _popupStack: popupStack
            };

            return wsPopup;

            function createPopup(options) {
                options = angular.extend({
                    scope: null
                }, options || {});

                var self = {};
                self.scope = (options.scope || $rootScope).$new();
                self.element = angular.element(POPUP_TPL);
                self.responseDeferred = $q.defer();

                $ionicBody.get().appendChild(self.element[0]);
                $compile(self.element)(self.scope);

                angular.extend(self.scope, {
                    cssClass: options.cssClass,
                    dismissable: options.dismissable || true,
                    buttonTapped: function(event) {
                        event = event.originalEvent || event; //jquery events

                        if (!event.defaultPrevented) {
                            self.responseDeferred.resolve(true);
                        }
                    }
                });

                $q.when(
                    options.templateUrl ?
                    $ionicTemplateLoader.load(options.templateUrl) :
                    (options.template || options.content || '')
                ).then(function(template) {
                    var popupBody = angular.element(self.element[0].querySelector('.popup-body'));
                    if (template) {
                        popupBody.html(template);
                        $compile(popupBody.contents())(self.scope);
                    } else {
                        popupBody.remove();
                    }
                });

                self.show = function() {
                    if (self.isShown || self.removed) return;

                    self.isShown = true;
                    ionic.requestAnimationFrame(function() {
                        //if hidden while waiting for raf, don't show
                        if (!self.isShown) return;

                        self.element.removeClass('popup-hidden');
                        self.element.addClass('popup-showing active');
                    });
                };

                self.hide = function(callback) {
                    callback = callback || noop;
                    if (!self.isShown) return callback();

                    self.isShown = false;
                    self.element.removeClass('active');
                    self.element.addClass('popup-hidden');
                    $timeout(callback, 250, false);
                };

                self.remove = function() {
                    if (self.removed) return;

                    self.hide(function() {
                        self.element.remove();
                        self.scope.$destroy();
                    });

                    self.removed = true;
                };

                return self;
            }

            function onHardwareBackButton() {
                var last = popupStack[popupStack.length - 1];
                last && last.responseDeferred.resolve();
            }

            function showPopup(options) {
                var popup = wsPopup._createPopup(options);
                var showDelay = 0;

                if (popupStack.length > 0) {
                    popupStack[popupStack.length - 1].hide();
                    showDelay = config.stackPushDelay;
                } else {
                    //Add popup-open & backdrop if this is first popup
                    $ionicBody.addClass('popup-open');
                    //only show the backdrop on the first popup
                    wsPopup._backButtonActionDone = $ionicPlatform.registerBackButtonAction(
                        onHardwareBackButton,
                        IONIC_BACK_PRIORITY.popup
                    );
                }

                // Expose a 'close' method on the returned promise
                popup.responseDeferred.promise.close = function popupClose(result) {
                    if (!popup.removed) popup.responseDeferred.resolve(result);
                };
                //DEPRECATED: notify the promise with an object with a close method
                popup.responseDeferred.notify({ close: popup.responseDeferred.close });

                doShow();

                return popup.responseDeferred.promise;

                function doShow() {
                    popupStack.push(popup);
                    $timeout(function () {
                        popup.show();
                        $timeout(function () {
                            popup.responseDeferred.resolve(true);
                        }, options.duration || 4000);
                    }, showDelay, false);

                    popup.responseDeferred.promise.then(function(result) {
                        var index = popupStack.indexOf(popup);
                        if (index !== -1) {
                            popupStack.splice(index, 1);
                        }

                        if (popupStack.length > 0) {
                            popupStack[popupStack.length - 1].show();
                        } else {
                            //Remove popup-open & backdrop if this is last popup
                            $timeout(function() {
                                // wait to remove this due to a 300ms delay native
                                // click which would trigging whatever was underneath this
                                if (!popupStack.length) {
                                    $ionicBody.removeClass('popup-open');
                                }
                            }, 400, false);
                            (wsPopup._backButtonActionDone || noop)();
                        }

                        popup.remove();

                        return result;
                    });
                }
            }
        }]);

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
                    data: [],
                    displayField: 'name',
                    valueField: 'id',
                    buttonClicked: angular.noop,
                    $deregisterBackButton: angular.noop,
                    cancelOnStateChange: true
                }, opts || {});

                // Compile the template
                var element = scope.element = $compile('<ion-combobox ng-class="cssClass"></ion-combobox>')(scope);

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

                scope.cancel = function() {
                    scope.removeSheet(opts.cancel);
                };

                scope.buttonClicked = function(index) {
                    if (opts.buttonClicked(index) === true) {
                        scope.removeSheet();
                    }
                };

                scope.showSheet();
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