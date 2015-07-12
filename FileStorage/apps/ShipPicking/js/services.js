
define(['app'], function (app) {

    app.register.factory('SHIPPICKCONSTANTS', function () {
        return {
            GetShipLineInfoCmd: 'UFIDA.U9.ISV.SM.IGetShipLineInfo',
            OnLineCheckCmd: 'UFIDA.U9.ISV.SM.IOnLineCheck',
            OnShipConformCmd: 'UFIDA.U9.ISV.SM.IShipConformISV',
            NumPerPage: 10
        };
    });

    app.register.factory('ShipPickService', ['$q', 'SVProxy', 'SHIPPICKCONSTANTS', function ($q, SVProxy, SHIPPICKCONSTANTS) {
        var o = {},
            shipLines = [];

        o.getShipLineInfo = function (shipId) {
            var defer = $q.defer();

            SVProxy.callSV({
                name: SHIPPICKCONSTANTS.GetShipLineInfoCmd,
                params: [shipId],
                onSuccess: function (data) {
                    shipLines = data;
                    defer.resolve(data);
                },
                onFailure: function (err) {
                    defer.reject(err);
                }
            });

            return defer.promise;
        };

        o.onLineCheck = function (barCodes, shipId) {
            var defer = $q.defer();

            SVProxy.callSV({
                name: SHIPPICKCONSTANTS.OnLineCheckCmd,
                params: [barCodes, shipId],
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onFailure: function (err) {
                    defer.reject(err);
                }
            });

            return defer.promise;
        };

        o.onShipConform = function (shipId) {
            var defer = $q.defer();

            SVProxy.callSV({
                name: SHIPPICKCONSTANTS.OnShipConformCmd,
                params: [shipId],
                onSuccess: function (data) {
                    defer.resolve(data);
                },
                onFailure: function (err) {
                    defer.reject(err);
                }
            });

            return defer.promise;
        };

        o.getPicksProfile = function () {
            var picksProfile = [];
            angular.forEach(shipLines, function (shipLine) {
                picksProfile.push({
                    DocID: shipLine.DocID,
                    DocNO: shipLine.DocNO,
                    DocLineSrcNo: shipLine.DocLineSrcNo,
                    Customer_Name: shipLine.Customer_Name,
                    BusinessPerson_Name: shipLine.BusinessPerson_Name
                });
            });
            return picksProfile;
        };

        o.getShipLines = function () {
            var tmpShipLines = [];
            angular.forEach(shipLines, function (shipLine) {
                tmpShipLines.push({
                    DocNO: shipLine.DocNO,
                    Customer_Name: shipLine.Customer_Name,
                    BusinessDate: shipLine.BusinessDate.format('yyyy-MM-dd'),
                    ItemMaster_Name: shipLine.ItemMaster_Name,
                    barCode: shipLine.barCode,
                    LotCode: shipLine.LotCode,
                    Wh_Name: shipLine.Wh_Name,
                    ShipQtyInvAmount: shipLine.ShipQtyInvAmount,
                    UOM_Code: shipLine.UOM_Code
                });
            });
            return tmpShipLines;
        };

        return o;
    }]);
});