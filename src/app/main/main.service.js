(function () {
  'use strict';

  angular.module('app.main')
    .factory('MainService', ['$location', '$q', function ($location, $q) {
      var db = new loki('current-period.json');
      var incomeItems = db.addCollection('incomeItems');
      var expensesItems = db.addCollection('expensesItems');
      var periodDates = db.addCollection('periodDates');
      var entires = db.addCollection('entries');

      var service = {
        go: go,
        getEntries: getEntries,
        addNewEntry: addNewEntry
      };
      return service;

      //////////

      function go(path) {
        $location.path(path);
      }

      function getEntries() {
        return $q(function (response, rejection) {
          db.loadDatabase({}, function () {
            response(db.getCollection('entries').data);
          })
        });
      }

      function addNewEntry(date, description, amountSpent) {
        return $q(function (response, rejection) {
          db.loadDatabase({}, function () {
            var tmp = db.getCollection('entries');
            tmp.insert({
              'date': date,
              'description': description,
              'amountSpent': amountSpent
            });
            db.saveDatabase();
            response(db.getCollection('entries').data);
          });
        });
      }

    }])
})();