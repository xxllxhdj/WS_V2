/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {

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
            /*
            template:
            '<div class="action-sheet-backdrop">' +
                '<div class="action-sheet-wrapper">' +
                    '<div class="action-sheet" ng-class="{\'action-sheet-has-icons\': $actionSheetHasIcon}">' +
                        '<div class="action-sheet-group action-sheet-options">' +
                            '<div class="action-sheet-title" ng-if="titleText" ng-bind-html="titleText"></div>' +
                            '<button class="button action-sheet-option" ng-click="buttonClicked($index)" ng-repeat="b in buttons" ng-bind-html="b.text"></button>' +
                            '<button class="button destructive action-sheet-destructive" ng-if="destructiveText" ng-click="destructiveButtonClicked()" ng-bind-html="destructiveText"></button>' +
                        '</div>' +
                        '<div class="action-sheet-group action-sheet-cancel" ng-if="cancelText">' +
                            '<button class="button" ng-click="cancel()" ng-bind-html="cancelText"></button>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>'
            */
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