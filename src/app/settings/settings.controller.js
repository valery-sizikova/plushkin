(function() {
  'use strict';

  angular.module('app.settings')
    .controller('SettingsController', ['$uibModalInstance', 'SettingsService', function($uibModalInstance, SettingsService) {
      var vm = this;

      /********** Settings **********/

      vm.savePeriodDates = savePeriodDates;
      vm.closeSettings = closeSettings;
      vm.openCalendar = openCalendar;
      vm.calendarOpened = {
        first: false,
        last: false
      };
      vm.altInputFormats = ['M!/d!/yyyy'];
      vm.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(2015, 5, 22),
        startingDay: 1,
        showWeeks: false
      };
      vm.firstDay = null;
      vm.lastDay = null;


      activate();

      //////////

      function activate() {
        SettingsService.getPeriodDates().then(function(response) {
          if (response !== undefined) {
            vm.firstDay = response.firstDay;
            vm.lastDay = response.lastDay;
          }
        });
      }

      function savePeriodDates(firstDay, lastDay) {
        SettingsService.savePeriodDates(firstDay, lastDay).then(function() {
          closeSettings();
        });
      }

      function closeSettings() {
        $uibModalInstance.close();
      }

      function openCalendar(type) {
        if (type === "first") {
          vm.calendarOpened.first = true;
        } else if (type === "last") {
          vm.calendarOpened.last = true;
        }
      }

    }]);
})();
