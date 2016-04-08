(function () {
  'use strict';

  angular.module('app.settings')
    .factory('SettingsService', ['$q', function ($q) {
      var db = new loki('current-period.json');
      var incomeItems = db.addCollection('incomeItems');
      var expensesItems = db.addCollection('expensesItems');
      var periodDates = db.addCollection('settings');
      var entires = db.addCollection('entries');

      var service = {
        getSettings: getSettings,
        saveSettings: saveSettings
      };
      return service;

      //////////

      function getSettings() {
        return $q(function(response, rejection) {
          db.loadDatabase({}, function() {
            response(db.getCollection('settings').data[0]);
          })
        })
      }

      function saveSettings(firstDay, lastDay, currency) {
        return $q(function(response, rejection) {
          db.loadDatabase({}, function() {
            var tmp = db.getCollection('settings');
            tmp.insert({
              'firstDay': Date.parse(firstDay),
              'lastDay': Date.parse(lastDay),
              'currency': currency
            });
            db.saveDatabase();
            response(db.getCollection('settings').data);
          })
        })
      }

    }])
})();