(function () {
  'use strict';

  angular.module('app.main')
    .factory('MainService', ['$location', '$q', function ($location, $q) {
      var db = new loki('current-period.json');
      var incomeItems = db.addCollection('incomeItems');
      var expensesItems = db.addCollection('expensesItems');
      var periodDates = db.addCollection('periodDates');

      var service = {
        go: go,
        getPeriodDates: getPeriodDates,
        savePeriodDates: savePeriodDates
      };
      return service;

      //////////

      function go(path) {
        $location.path(path);
      }

      function getPeriodDates() {
        return $q(function(response, rejection) {
          db.loadDatabase({}, function() {
            response(db.getCollection('periodDates').data[0]);
          })
        })
      }

      function savePeriodDates(firstDay, lastDay) {
        return $q(function(response, rejection) {
          db.loadDatabase({}, function() {
            var tmp = db.getCollection('periodDates');
            tmp.insert({
              'firstDay': firstDay,
              'lastDay': lastDay
            });
            db.saveDatabase();
            response(db.getCollection('periodDates').data);
          })
        })
      }

    }])
})();