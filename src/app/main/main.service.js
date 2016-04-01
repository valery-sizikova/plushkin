(function () {
  'use strict';

  angular.module('app.main')
    .factory('MainService', ['$location', '$q', function ($location, $q) {
      var db = new loki('current-period.json');
      var incomeItems = db.addCollection('incomeItems');
      var expensesItems = db.addCollection('expensesItems');
      var periodDates = db.addCollection('periodDates');

      var service = {
        go: go
      };
      return service;

      //////////

      function go(path) {
        $location.path(path);
      }

    }])
})();