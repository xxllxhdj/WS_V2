
define(['app'], function (app) {
    app.register.filter('PicksQuery', function () {
        return function (picks, queryStr) {
            if (queryStr === '') {
                return picks;
            }
            var aPicks = [];
            angular.forEach(picks, function (pick) {
                if(pick.DocNO.toUpperCase().indexOf(queryStr.toUpperCase()) > -1 ||
                    pick.Customer_Name.toUpperCase().indexOf(queryStr.toUpperCase()) > -1
                ) {
                    aPicks.push(pick);
                }
            });
            return aPicks;
        };
    });
});