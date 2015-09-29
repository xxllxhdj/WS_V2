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
                var gradientColor = gradientColor([255, 165, 0], [255, 0, 0], 85);
                for (var i = 8; i <= 92; i++) {
                    rag = angular.element('<div class="rag"></div>');
                    rag[0].style['-webkit-transform'] = 'rotate(' + 3.6 * i + 'deg)';
                    rag[0].style['transform'] = 'rotate(' + 3.6 * i + 'deg)';
                    rag[0].style['background'] = gradientColor[i - 8];
                    rangeContainer.append(rag);
                }
                element.append(rangeContainer);

                return { pre: prelink };
                function prelink($scope, $element, $attr) {}

                function gradientColor(startColor, endColor, step) {
                    var sR = (endColor[0] - startColor[0]) / step,
                        sG = (endColor[1] - startColor[1]) / step,
                        sB = (endColor[2] - startColor[2]) / step;

                    var colorArr = [];
                    for(var i = 0; i < step; i++) {
                        var rgb = 'rgb(' + parseInt(sR * i + startColor[0]) + ',' +
                            parseInt(sG * i + startColor[1]) + ',' + parseInt(sB * i + startColor[2]) + ')';
                        colorArr.push(rgb);
                    }
                    return colorArr;
                }
            }
        };
    }]);
});