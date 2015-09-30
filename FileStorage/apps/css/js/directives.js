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
                '<i class="temp">{{weather.temp + "&deg;"}}</i>' +
                '<i class="icon ion-ios-rainy-outline weather"></i>' +
                '<i class="range-temp low">{{weather.tLow + "&deg;C"}}</i>' +
                '<i class="range-temp high">{{weather.tHigh + "&deg;C"}}</i>' +
                '<i class="active-rag"></i>' +
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
                function prelink($scope, $element, $attr) {
                    $timeout(init);

                    function init () {
                        var tHigh = $scope.weather.tHigh,
                            tLow = $scope.weather.tLow,
                            deltaT;
                        if (tHigh === tLow) {
                            deltaT = 5;
                        } else {
                            deltaT = parseInt(30 / (tHigh - tLow));
                            if (deltaT < 1) {
                                deltaT = 1;
                            } else if (deltaT > 5) {
                                deltaT = 5;
                            }
                        }
                        var step = deltaT * (tHigh - tLow),
                            gradientColor = createGradientColor([255, 165, 0], [255, 0, 0], step),
                            rangeContainer = $element[0].querySelector('.range-container').children;
                        for (var i = 0; i <= step; i++) {
                            rangeContainer[i + 48].style['background'] = gradientColor[i];
                        }
                        var angle = (step + 5) * 3.6 * Math.PI / 180,
                            posX = 125 * Math.sin(angle),
                            posY = 125 * (1 - Math.cos(angle)),
                            highElement = $element[0].children[3];
                        highElement.style['top'] = posY + 'px';
                        highElement.style['margin-left'] = posX + 'px';

                        var activeRange = $element[0].children[4];
                        activeRange.style['background'] = gradientColor[0];
                        activeRange.style['-webkit-transform'] = 'rotate(' + 3.6 * 30 + 'deg)';
                        activeRange.style['transform'] = 'rotate(' + 3.6 * 30 + 'deg)';
                    }

                    function createGradientColor(startColor, endColor, step) {
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
            }
        };
    }]);
});