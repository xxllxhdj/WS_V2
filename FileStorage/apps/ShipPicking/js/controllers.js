
define(['app', 'ngCordova'], function (app) {

    app.register.controller('PicksCtrl', ['$scope', 'ShipPickService', 'SHIPPICKCONSTANTS',
        function ($scope, ShipPickService, SHIPPICKCONSTANTS) {
            $scope.pickData = {
                picks: ShipPickService.getPicksProfile(),
                query: '',
                currentNum: 0
            };

            refreshPicks();

            $scope.doRefresh = function () {
                refreshPicks();
                $scope.$broadcast('scroll.refreshComplete');
            };

            function refreshPicks () {
                if ($scope.pickData.currentNum < $scope.pickData.picks.length) {
                    $scope.pickData.currentNum += SHIPPICKCONSTANTS.NumPerPage;
                } else {
                    alert('没有新数据');
                    return;
                }
            }
        }]);

    app.register.controller('ShipLinesCtrl', ['$scope', '$timeout', '$stateParams', '$state', '$cordovaBarcodeScanner', 'ShipPickService', 'SHIPPICKCONSTANTS',
        function ($scope, $timeout, $stateParams, $state, $cordovaBarcodeScanner, ShipPickService, SHIPPICKCONSTANTS) {
            $scope.shipData = {
                shipLines: ShipPickService.getShipLines(),
                barCodes: [],
                inputCode: '',
                barCode: true,
                pickDetail: false,
                confirmDisabled: true,
                currentNum: 0,
                timeOut: null
            };

            $scope.activeBarCode = function () {
                $scope.shipData.barCode = true;
                $scope.shipData.pickDetail = false;
            };
            $scope.activePickDetail = function () {
                $scope.shipData.barCode = false;
                $scope.shipData.pickDetail = true;
            };

            $scope.refreshBarcode = function () {
                $timeout.cancel($scope.shipData.timeOut);
                $scope.shipData.timeOut = $timeout(function () {
                    if ($scope.shipData.inputCode) {
                        $scope.shipData.barCodes.push({
                            code: $scope.shipData.inputCode,
                            error: false
                        });
                        //清除输入框
                        $scope.shipData.inputCode ='';
                    }
                }, 500);
            };

            $scope.deleteBarcodeByIndex = function (index) {
                $scope.shipData.barCodes.splice(index,1);
            };

            $scope.checkInline = function () {
                var tempCodes = [];
                angular.forEach($scope.shipData.barCodes, function (barCode) {
                    tempCodes.push(barCode.code);
                });
                ShipPickService.onLineCheck(tempCodes, $stateParams.docId).then(function (checkShipLines) {
                    var validLines = {},
                        barcodeResult = {},
                        hasValid = false;
                    angular.forEach(checkShipLines, function (checkShipLine) {
                        if (checkShipLine.DocNO) {
                            hasValid = true;
                            validLines[checkShipLine.DocNO] = checkShipLine.BarCode_Code;
                        }
                        barcodeResult[checkShipLine.BarCode_Code] = !!checkShipLine;
                    });

                    angular.forEach($scope.shipData.shipLines, function (shipLine) {
                        if (validLines.hasOwnProperty(shipLine.DocNO)) {
                            $scope.shipData.shipLines[j].barCode = validLines[shipLine.DocNO];
                        }
                    });
                    angular.forEach($scope.shipData.barCodes, function (barCode) {
                        barCode.error = barcodeResult[barCode.code];
                    });

                    $scope.shipData.confirmDisabled = !hasValid;
                    if (hasValid) {
                        $scope.activePickDetail();
                    }
                }, function (err) {
                    angular.forEach($scope.shipData.barCodes, function (barCode) {
                        barCode.error = true;
                    });
                });
            };

            $scope.confirmShip = function () {
                ShipPickService.onShipConform($stateParams.docId).then(function (data) {
                    $scope.shipData.confirmDisabled = true;
                    $state.go('picks');
                }, function (err) {
                    alert(err._message);
                });
            };

            refreshShipLines();
            $scope.doRefresh = function () {
                if ($scope.shipData.pickDetail) {
                    refreshShipLines();
                }
                $scope.$broadcast('scroll.refreshComplete');
            };
            function refreshShipLines () {
                if ($scope.shipData.currentNum < $scope.shipData.shipLines.length) {
                    $scope.shipData.currentNum += SHIPPICKCONSTANTS.NumPerPage;
                } else {
                    alert('没有新数据');
                    return;
                }
            }

            $scope.scanCode = function () {
                $cordovaBarcodeScanner.scan()
                    .then(function (scanResult) {
                        //if (scanResult.format === 'EAN_13') {
                        $scope.shipData.barCodes.push({
                            code: scanResult.text,
                            error: false
                        });
                        //}
                    });
            };
        }]);
});