/**
 * Created by xuxle on 2015/6/19.
 */
define(['app', appHelp.convertURL('ionic/lib/vslider.js', true)], function (app) {

    app.register.directive('scrollAccordion', ['$timeout', function($timeout) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template:
            '<ion-scroll class="scroll-accordion">' +
                '<div ng-transclude></div>' +
            '</ion-scroll>'
        };
    }]);

    app.register.directive('scrollAccordionItem', function() {
        return {
            restrict: 'E',
            scope: {
                heading: '@'
            },
            transclude: true,
            replace: true,
            template:
                '<div class="scroll-accordion-item">' +
                    '<div class="header">{{heading}}</div>' +
                    '<div class="body" ng-transclude></div>' +
                '</div>'
        };
    });

    app.register.directive('buttonFlow', ['$timeout', function($timeout) {
        return {
            restrict: 'E',
            scope: {
                buttons: '=',
                start: '@',
                cssClass: '@',
                onFlowSelect: '&'
            },
            replace: true,
            template:
                '<div class="button-flow" ng-class="cssClass">' +
                    '<div class="flow-box"></div>' +
                    '<button ng-repeat="flow in buttons" ng-click="onClick($index)">{{flow}}</button>' +
                '</div>',
            link: function($scope, $element, $attr) {
                $timeout(init);

                $scope.onClick = function (index) {
                    translate(index, 160);
                    updateFlow(-1);
                    $timeout(function () {
                        updateFlow(index);
                    }, 160);
                    $scope.onFlowSelect && $scope.onFlowSelect({index: index});
                };

                var width = 40;
                function init () {
                    var buttons = $element.find('button'),
                        len = buttons.length,
                        element = $element[0];
                    if (len === 0) {
                        return;
                    }
                    angular.forEach(buttons, function (button) {
                        if (button.offsetWidth > width) {
                            width = button.offsetWidth;
                        }
                    });
                    angular.forEach(buttons, function (button) {
                        button.style.width = width + 'px';
                    });
                    var start = parseInt($attr.start) || 0;
                    translate(start, 0);
                    updateFlow(start);
                }

                function translate(to, speed) {

                    var flowBox = $element[0].children[0];
                    var style = flowBox && flowBox.style;

                    if (!style) return;

                    var buttons = $element.find('button');
                    var dist = to * width;

                    style.webkitTransitionDuration =
                        style.MozTransitionDuration =
                            style.msTransitionDuration =
                                style.OTransitionDuration =
                                    style.transitionDuration = speed + 'ms';

                    style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
                    style.msTransform =
                        style.MozTransform =
                            style.OTransform = 'translateX(' + dist + 'px)';

                }
                function updateFlow (index) {
                    var buttons = $element.find('button'),
                        el;
                    angular.forEach(buttons, function (button, i) {
                        el = angular.element(button);
                        if (i === index) {
                            el.addClass('active');
                        } else {
                            el.removeClass('active');
                        }
                    });
                }
            }
        };
    }]);

    app.register.directive('vSlideBox', [
        '$timeout',
        '$compile',
        '$ionicSlideBoxDelegate',
        '$ionicHistory',
        '$ionicScrollDelegate',
        function($timeout, $compile, $ionicSlideBoxDelegate, $ionicHistory, $ionicScrollDelegate) {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                scope: {
                    autoPlay: '=',
                    doesContinue: '@',
                    slideInterval: '@',
                    showPager: '@',
                    pagerClick: '&',
                    disableScroll: '@',
                    onSlideChanged: '&',
                    activeSlide: '=?'
                },
                controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                    var _this = this;

                    var shouldAutoPlay = angular.isDefined($attrs.autoPlay) ? !!$scope.autoPlay : false;
                    var slideInterval = shouldAutoPlay ? $scope.$eval($scope.slideInterval) || 4000 : 0;

                    var slider = new ionic.views.vSlider({
                        el: $element[0],
                        auto: slideInterval,
                        startSlide: $scope.activeSlide,
                        slidesChanged: function() {
                            $scope.currentSlide = slider.currentIndex();

                            // Try to trigger a digest
                            $timeout(function() {});
                        },
                        callback: function(slideIndex) {
                            $scope.currentSlide = slideIndex;
                            $scope.onSlideChanged({ index: $scope.currentSlide, $index: $scope.currentSlide});
                            $scope.$parent.$broadcast('vSlideBox.slideChanged', slideIndex);
                            $scope.activeSlide = slideIndex;
                            // Try to trigger a digest
                            $timeout(function() {});
                        },
                        onDrag: function() {
                            freezeAllScrolls(true);
                        },
                        onDragEnd: function() {
                            freezeAllScrolls(false);
                        }
                    });

                    function freezeAllScrolls(shouldFreeze) {
                        if (shouldFreeze && !_this.isScrollFreeze) {
                            $ionicScrollDelegate.freezeAllScrolls(shouldFreeze);

                        } else if (!shouldFreeze && _this.isScrollFreeze) {
                            $ionicScrollDelegate.freezeAllScrolls(false);
                        }
                        _this.isScrollFreeze = shouldFreeze;
                    }

                    slider.enableSlide($scope.$eval($attrs.disableScroll) !== true);

                    $scope.$watch('activeSlide', function(nv) {
                        if (angular.isDefined(nv)) {
                            slider.slide(nv);
                        }
                    });

                    //$scope.$on('slideBox.nextSlide', function() {
                    //    slider.next();
                    //});
                    //
                    //$scope.$on('slideBox.prevSlide', function() {
                    //    slider.prev();
                    //});
                    //
                    //$scope.$on('slideBox.setSlide', function(e, index) {
                    //    slider.slide(index);
                    //});

                    //Exposed for testing
                    this.__slider = slider;

                    var deregisterInstance = $ionicSlideBoxDelegate._registerInstance(
                        slider, $attrs.delegateHandle, function() {
                            return $ionicHistory.isActiveScope($scope);
                        }
                    );
                    $scope.$on('$destroy', function() {
                        deregisterInstance();
                        slider.kill();
                    });

                    this.slidesCount = function() {
                        return slider.slidesCount();
                    };

                    this.onPagerClick = function(index) {
                        void 0;
                        $scope.pagerClick({index: index});
                    };

                    $timeout(function() {
                        slider.load();
                    });
                }],
                template: '<div class="v-slider">' +
                '<div class="v-slider-slides" ng-transclude>' +
                '</div>' +
                '</div>',

                link: function($scope, $element, $attr) {
                }
            };
        }]);
    app.register.directive('vSlide', function() {
            return {
                restrict: 'E',
                require: '^vSlideBox',
                compile: function(element) {
                    element.addClass('v-slider-slide');
                }
            };
        });
    app.register.directive('scrollSelector', ['$ionicBind', '$timeout', '$ionicScrollDelegate', function($ionicBind, $timeout, $ionicScrollDelegate) {
        return {
            restrict: 'E',
            scope: {
                list: '=',
                selected: '=',
                displayField: '@',
                cssClass: '@'
            },
            replace: true,
            template:
                '<div class="scroll-selector" ng-class="cssClass">' +
                    '<div class="select-box">' +
                    '</div>' +
                    '<ion-scroll class="scroll-selector-content" scrollbar-y="false" on-scroll="onScroll()">' +
                        '<ion-list>' +
                            '<ion-item></ion-item>' +
                            '<ion-item ng-repeat="t in list">{{t[displayField]}}</ion-item>' +
                            '<ion-item></ion-item>' +
                        '</ion-list>' +
                    '</ion-scroll>' +
                '</div>',
            compile: function(element, attr) {
                var ionScroll = element.find('ion-scroll');

                angular.forEach({
                    'delegate-handle': attr.delegateHandle
                }, function(value, name) {
                    if (angular.isDefined(value)) {
                        ionScroll.attr(name, value);
                    }
                });

                return { pre: prelink };

                function prelink($scope, $element, $attr) {
                    var index = 0;
                    var timeOut = null;
                    var height = 34;

                    $timeout(init);

                    $scope.onScroll = function () {
                        scrolling();
                        if (timeOut) {
                            $timeout.cancel(timeOut);
                        }
                        timeOut = $timeout(scrollFinished, 260);
                    };

                    function init () {
                        var selected = $scope.selected,
                            len = $scope.list.length;
                        for (var i = 0; i < len; i++) {
                            if ($scope.list[i][$attr.valueField] === selected) {
                                index = i;
                                break;
                            }
                        }
                        var scrollCtrl = $ionicScrollDelegate.$getByHandle($attr.delegateHandle);
                        scrollCtrl.scrollTo(0, index * height);
                    }
                    function scrolling () {
                        var scrollCtrl = $ionicScrollDelegate.$getByHandle($attr.delegateHandle),
                            pos = scrollCtrl.getScrollPosition(),
                            scrollView = scrollCtrl.getScrollView();
                        if (pos < 0 || pos > scrollView.__maxScrollTop) {
                            return;
                        }
                        var tmpIndex = parseInt(pos.top / height + 0.5) + 1;
                        var len = $scope.list.length + 2;
                        if (tmpIndex < 0) {
                            tmpIndex = 0;
                        }
                        if (tmpIndex >= len) {
                            tmpIndex = len - 1;
                        }
                        if (index === tmpIndex) {
                            return;
                        }
                        index = tmpIndex;
                        select();
                    }
                    function scrollFinished () {
                        var scrollCtrl = $ionicScrollDelegate.$getByHandle($attr.delegateHandle),
                            pos = scrollCtrl.getScrollPosition(),
                            scrollView = scrollCtrl.getScrollView();
                        if (pos < 0 || pos > scrollView.__maxScrollTop) {
                            return;
                        }
                        if (pos.top % height !== 0) {
                            var index = parseInt(pos.top / height + 0.5);
                            scrollCtrl.scrollTo(0, index * height, true);
                        }
                    }
                    function select() {
                        var ionList = $element.find('ion-item'),
                            el;
                        angular.forEach(ionList, function (ionItem, i) {
                            el = angular.element(ionItem);
                            if (i === index) {
                                el.addClass('active');
                            } else {
                                el.removeClass('active');
                            }
                        });

                        var tmpIndex = index - 1;
                        if (tmpIndex < 0) {
                            tmpIndex = 0;
                        }
                        if (tmpIndex >= $scope.list.length) {
                            tmpIndex = $scope.list.length - 1;
                        }
                        $scope.$apply(function() {
                            $scope.selected = $scope.list[tmpIndex][$attr.valueField];
                        });
                    }
                }
            }
        };
    }]);

    app.register.directive('ionCombobox', ['$document', function($document) {
        return {
            restrict: 'E',
            scope: true,
            replace: true,
            link: function($scope, $element) {

                var keyUp = function(e) {
                    if (e.which == 27) {
                        $scope.cancel();
                        $scope.$apply();
                    }
                };

                var backdropClick = function(e) {
                    if (e.target == $element[0]) {
                        $scope.cancel();
                        $scope.$apply();
                    }
                };
                $scope.$on('$destroy', function() {
                    $element.remove();
                    $document.unbind('keyup', keyUp);
                });

                $document.bind('keyup', keyUp);
                $element.bind('click', backdropClick);
            },
            template:
            '<div class="action-sheet-backdrop">' +
                '<div class="action-sheet-wrapper">' +
                    '<div class="combobox-sheet">' +
                        '<div class="combobox-body">' +
                            '<div class="combobox-title">' +
                                '<button class="button" ng-click="buttonClicked(0)">取消</button>' +
                                '<button class="button" ng-click="buttonClicked(1)">确认</button>' +
                            '</div>' +
                            '<ion-scroll class="combobox-content" scrollbar-y="false">' +
                                '<ion-list>' +
                                    '<ion-item ng-repeat="t in data">{{t[displayField]}}</ion-item>' +
                                '</ion-list>' +
                            '</ion-scroll>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
        };
    }]);

    app.register.directive('itemExpander', function() {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                expanded: '=?'
            },
            template:
                '<div class="expander">' +
                    '<div collapse="!expanded">' +
                        '<div class="body" ng-transclude></div>' +
                    '</div>' +
                    '<div class="footer">' +
                        '<button class="button button-clear button-icon button-full" ng-click="toggle()">' +
                            '<i class="icon" ng-class="{' + "'ion-android-arrow-dropdown':!expanded,'ion-android-arrow-dropup':expanded" + '}"></i>' +
                        '</button>' +
                    '</div>' +
                '</div>',
            link: function(scope, element, attrs) {
                scope.toggle = function () {
                    scope.expanded = !scope.expanded;
                };
            }
        };
    });

    app.register.directive('itemExpanded', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$watch(attrs.itemExpanded, function (value) {
                    var delay = value ? 350 : 0;
                    $timeout(function () {
                        update(value);
                    }, delay);
                });

                function update (itemExpanded) {
                    var expandHeight = itemExpanded ? 145 : 20,
                        navBarHeight = 44,
                        tabsHeight = 48,
                        docHeight = document.body.scrollHeight;
                    element[0].style.height = (docHeight - expandHeight - navBarHeight - tabsHeight) + 'px';
                }
            }
        };
    }]);

    app.register.directive('performanceNum', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                num: '=?',
                trend: '=?'
            },
            template:
                '<label class="pref-num">' +
                    '<span>' +
                        '{{num | number}}' +
                        '<i class="icon ion-social-yen"></i>' +
                    '</span>' +
                    '<i class="icon" ng-class="{' + "'ion-ios-arrow-thin-up':trend===1,'ion-ios-minus-empty':trend===0,'ion-ios-arrow-thin-down':trend===-1" + '}"></i>' +
                '</label>'
        };
    });
});