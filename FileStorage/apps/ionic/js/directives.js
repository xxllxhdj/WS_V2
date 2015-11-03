/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {

    app.register.directive('scrollAccordion', ['$timeout', '$ionicScrollDelegate', function($timeout, $ionicScrollDelegate) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            template:
                '<div class="scroll-accordion">' +
                    '<ion-scroll class="scroll-accordion-content" on-scroll="onScroll()">' +
                        '<div class="scroll-accordion-wrapper" ng-transclude></div>' +
                    '</ion-scroll>' +
                '</div>',
            compile: function(element, attr) {
                var ionScroll = element.find('ion-scroll');

                angular.forEach({
                    'delegate-handle': attr.delegateHandle
                }, function (value, name) {
                    if (angular.isDefined(value)) {
                        ionScroll.attr(name, value);
                    }
                });

                return {pre: prelink};

                function prelink($scope, $element, $attr) {
                    //$timeout(init);

                    $scope.onScroll = function () {
                        scrolling();
                    };

                    var _index = -1,
                        headerHeight;
                    function scrolling () {
                        var scrollCtrl = $ionicScrollDelegate.$getByHandle($attr.delegateHandle),
                            pos = scrollCtrl.getScrollPosition(),
                            scrollView = scrollCtrl.getScrollView();
                        if (pos.top < 0 || pos.top > scrollView.__maxScrollTop) {
                            return;
                        }
                        updateActiveAccordion(pos.top);
                        var activeHeight = getActiveHeight();
                        var deltaY = activeHeight - pos.top - headerHeight;
                        //console.log(deltaY);
                        if (Math.abs(deltaY) < 0.000001) {
                            //console.log('666');
                        } else if (Math.abs(deltaY) < headerHeight) {
                            //if (deltaY < 0 && pos.top > lastTop) {
                            //    translate(deltaY);
                            //}
                            //if (deltaY > 0 && pos.top < lastTop) {
                            //    translate(deltaY);
                            //}
                        }
                    }
                    function init () {
                    }
                    function updateActiveAccordion (scrollTop) {
                        var accordions = $element[0].querySelector('.scroll-accordion-wrapper').children,
                            len = accordions.length,
                            temp = 0;
                        for (var i = 0; i < len; i++) {
                            if (accordions[i].offsetTop > parseInt(scrollTop)) {
                                temp = i - 1;
                                break;
                            }
                        }
                        if (i === 0) {
                            temp = 0;
                        } else if (i === len) {
                            temp = len - 1;
                        }
                        if (temp !== _index) {
                            _index = temp;
                            //updateStyle();
                            console.log(_index);
                        }
                    }
                    function updateStyle () {
                        var accordions = $element[0].querySelector('.scroll-accordion-wrapper').children,
                            len = accordions.length,
                            style;
                        for (var i = 0; i < len; i++) {
                            style = accordions[i].children[0].style;
                            if (!style) {
                                continue;
                            }
                            if (i === _index) {
                                style.position = 'absolute';
                                style.top = element[0].offsetTop + 'px';
                            } else {
                                style.position = 'relative';
                            }
                        }
                    }
                    function getActiveHeight () {
                        var accordions = $element[0].querySelector('.scroll-accordion-wrapper'),
                            activeHeight = 0;
                        for (var i = 0; i <= _index; i++) {
                            activeHeight += accordions.children[i].offsetHeight;
                        }
                        return activeHeight;
                    }
                }
            }
        };
    }]);

    app.register.directive('scrollAccordionItem', function() {
        return {
            restrict: 'E',
            scope: {
                title: '@'
            },
            transclude: true,
            replace: true,
            template:
                '<div class="scroll-accordion-item">' +
                    '<div class="header">{{title}}</div>' +
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
                    '<ion-scroll class="scroll-selector-content" scrollbar-y="false" has-bouncing="true" on-scroll="onScroll()">' +
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
                        if (pos.top < 0 || pos.top > scrollView.__maxScrollTop) {
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
                        if (pos.top < 0 || pos.top > scrollView.__maxScrollTop) {
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
    /*
    app.register.directive('slickScroll', function () {
        return {
            restrict: 'E',
            replace: true,
            scope: {
                hugeData: '=?'
            },
            template:
            '<div class="slick-scroll">' +
                '<ion-scroll has-bouncing="true" on-scroll="onScroll()">' +
                    '<div class="data-canvas"></div>' +
                '</ion-scroll>' +
            '</div>',
            controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
                var ionScroll = $element.find('ion-scroll'),
                    canvas = $element[0].querySelector('.data-canvas');

                var height = angular.isDefined($attrs.dataHeight) ? parseInt($attrs.dataHeight) : 54;

                init();

                $scope.onScroll = function () {
                    handleScroll();
                };

                function init() {
                    canvas.style.height = height * getDataLength() + 'px';
                    handleScroll();
                }
                function handleScroll() {
                }
                function getDataLength() {
                    return $scope.hugeData.length;
                }
            }]
        };
    });
    */
    app.register.directive('slickCanvas', function () {
        return {
            restrict: 'E',
            replace: true,
            require: ['?^$ionicScroll', 'slickCanvas'],
            controller: 'slickCanvasCtrl',
            scope: {
                hugeData: '=?'
            },
            template: '<div class="data-canvas"></div>',
            link: function($scope, $element, $attrs, ctrls) {
                var scrollCtrl = ctrls[0],
                    slickCanvasCtrl = ctrls[1];
                slickCanvasCtrl.init(scrollCtrl);
            }
        };
    });

    app.register.controller('slickCanvasCtrl', ['$scope', '$element', '$attrs',
        function ($scope, $element, $attrs) {
            var self = this,
                scrollCtrl, scrollParent, scrollChild;

            var height = angular.isDefined($attrs.dataHeight) ? parseInt($attrs.dataHeight) : 54,
                prevScrollTop = 0,
                rowsCache = {},
                viewportH, scrollTop, vScrollDir;

            self.init = function (ctrl) {
                scrollCtrl = ctrl;
                scrollParent = $element.parent().parent()[0];
                scrollChild = $element.parent()[0];

                $element[0].style.height = height * getDataLength() + 'px';
                viewportH = scrollParent.offsetHeight;

                if (!scrollParent || !scrollParent.classList.contains('ionic-scroll') ||
                    !scrollChild || !scrollChild.classList.contains('scroll')) {
                    throw new Error('SlickCanvas must be immediate child of ion-content or ion-scroll');
                }

                ionic.on('scroll', handleScroll, scrollParent);

                // cleanup when done
                $scope.$on('$destroy', destroy);

                handleScroll();
            };

            function getDataLength() {
                return $scope.hugeData.length;
            }
            function getDataItem(i) {
                return $scope.hugeData[i];
            }
            function getRowTop(row) {
                return height * row;
            }
            function handleScroll() {
                var scrollPos = scrollCtrl.getScrollPosition();
                scrollTop = scrollPos.top;

                if (scrollTop < 0) {
                    return;
                }

                var vScrollDist = Math.abs(scrollTop - prevScrollTop);
                if (!vScrollDist) {
                    return;
                }

                vScrollDir = prevScrollTop < scrollTop ? 1 : -1;
                prevScrollTop = scrollTop;

                render();
            }
            function render() {
                var visible = getVisibleRange(),
                    rendered = getRenderedRange();

                // remove rows no longer in the viewport
                cleanupRows(rendered);

                // render missing rows
                renderRows(rendered);
            }
            function getVisibleRange(viewportTop) {
                if (viewportTop == null) {
                    viewportTop = scrollTop;
                }
                return {
                    top: getRowFromPosition(viewportTop),
                    bottom: getRowFromPosition(viewportTop + viewportH) + 1
                };
            }
            function getRenderedRange(viewportTop) {
                var range = getVisibleRange(viewportTop),
                    buffer = Math.round(viewportH / height),
                    minBuffer = 3;

                if (vScrollDir == -1) {
                    range.top -= buffer;
                    range.bottom += minBuffer;
                } else if (vScrollDir == 1) {
                    range.top -= minBuffer;
                    range.bottom += buffer;
                } else {
                    range.top -= minBuffer;
                    range.bottom += minBuffer;
                }

                range.top = Math.max(0, range.top);
                range.bottom = Math.min(getDataLength() - 1, range.bottom);

                return range;
            }
            function getRowFromPosition(y) {
                return Math.floor(y / height);
            }
            function cleanupRows(rangeToKeep) {
                for (var i in rowsCache) {
                    if (i < rangeToKeep.top || i > rangeToKeep.bottom) {
                        removeRowFromCache(i);
                    }
                }
            }
            function removeRowFromCache(row) {
                var cacheEntry = rowsCache[row];
                if (!cacheEntry) {
                    return;
                }

                $element[0].removeChild(cacheEntry);

                delete rowsCache[row];
            }
            function renderRows(range) {
                var parentNode = $element[0],
                    dataLength = getDataLength(),
                    item, data;

                for (var i = range.top, ii = range.bottom; i <= ii; i++) {
                    if (rowsCache[i]) {
                        continue;
                    }
                    data = getDataItem(i);
                    item = angular.element('<h4 style="top:' + getRowTop(i) + 'px;height:54px">' + data.name + '</h4>');
                    $element.append(item)
                    rowsCache[i] = item[0];
                }
            }
            function destroy() {
                ionic.off('scroll', handleScroll, scrollParent);
                scrollParent = null;
                scrollChild = null;
            }
        }
    ]);

    app.register.directive('dataItem', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            template:
            '<div class="data-item" ng-transclude>' +
            '</div>'
        };
    });
});