/**
 * Created by xuxle on 2015/6/19.
 */
define(['app'], function (app) {
    app.register.directive('weatherRange', ['$timeout', function($timeout) {
        return {
            restrict: 'E',
            scope: {
                weather: '='
            },
            replace: true,
            template:
            '<div class="weather-range" ng-class="cssClass">' +
                '<div class="temp">{{weather.temp + "&deg;"}}</div>' +
                '<i class="icon ion-ios-rainy-outline weather"></i>' +
            '</div>',
            compile: function(element, attr) {
                var rangeContainer = angular.element('<div class="range-container"></div>'),
                    rag;
                for (var i = 8; i <= 92; i++) {
                    rag = angular.element('<div class="rag"></div>');
                    rag[0].style['-webkit-transform'] = 'rotate(' + 3.6 * i + 'deg)';
                    rag[0].style['transform'] = 'rotate(' + 3.6 * i + 'deg)';
                    rangeContainer.append(rag);
                }
                element.append(rangeContainer);

                return { pre: prelink };
                function prelink($scope, $element, $attr) {}
            }
        };
    }]);
});