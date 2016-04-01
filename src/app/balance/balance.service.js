(function () {
  'use strict';

  angular.module('app.balance')
    .factory('BalanceService', ['$q', function ($q) {
      var db = new loki('current-period.json');
      var incomeItems = db.addCollection('incomeItems');
      var expensesItems = db.addCollection('expensesItems');
      var periodDates = db.addCollection('periodDates');

      var service = {
        getBalanceData: getBalanceData,
        addNewBalanceItem: addNewBalanceItem
      };
      return service;

      //////////

      function getBalanceData(type) {
        return $q(function (response, rejection) {
          db.loadDatabase({}, function () {
            response(db.getCollection(type).data);
          })
        });
      }

      function addNewBalanceItem(type, name, amount) {
        return $q(function (response, rejection) {
          db.loadDatabase({}, function () {
            var tmp = db.getCollection(type);
            tmp.insert({
              'name': name,
              'amount': amount
            });
            db.saveDatabase();
            response(db.getCollection(type).data);
          });
        });
      }

    }])
})();