(function() {
  'use strict';

  angular.module('app.main')
    .controller('MainController', ['$scope', '$location', 'MainService', 'BalanceService', 'SettingsService', function($scope, $location, MainService, BalanceService, SettingsService) {
      var vm = this;
      vm.go = MainService.go;

      /********** Balance **********/
      vm.incomeTotal = false;
      vm.incomeItems = [];
      vm.expensesTotal = false;
      vm.expensesItems = [];
      vm.nameIncome = false;
      vm.amountIncome = false;
      vm.nameExpenses = false;
      vm.amountExpenses = false;
      vm.addNewBalanceItem = addNewBalanceItem;

      /********** Settings **********/
      vm.settingsOpen = false;
      vm.toggleSettings = toggleSettings;
      vm.calendarOpened = {
        first: false,
        last: false
      };
      vm.openCalendar = openCalendar;
      vm.altInputFormats = ['M!/d!/yyyy'];
      vm.dateOptions = {
        formatYear: 'yy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(2015, 5, 22),
        startingDay: 1
      };
      vm.firstDay = null;
      vm.lastDay = null;
      vm.period = {};
      vm.savePeriodDates = savePeriodDates;

      /********** Main **********/
      vm.getDailyBudget = getDailyBudget;
      vm.dailyBudget = false;
      vm.entries = [];
      vm.updateEntries = updateEntries;
      vm.addNewEntry = addNewEntry;
      vm.entryDate = false;
      vm.entryDescription = false;
      vm.entryAmountSpent = false;
      vm.getPossibleAmountToSpend = getPossibleAmountToSpend;

      activate();

      //////////

      function activate() {
        SettingsService.getPeriodDates().then(function(response) {
          if (response !== undefined) {
            vm.firstDay = Date.parse(response.firstDay);
            vm.lastDay = Date.parse(response.lastDay);
          }
        });
        updateBalanceData('incomeItems');
        updateBalanceData('expensesItems');
        updateEntries();
      }


      /********** Balance **********/

      function getTotal(items) {
        var total = 0;
        for (var i = 0; i < items.length; i++) {
          total += parseInt(items[i].amount);
        }
        return total;
      }

      function updateBalanceData(type) {
        if (type === 'incomeItems') {
          BalanceService.getBalanceData('incomeItems').then(function(response) {
            vm.incomeItems = response;
            vm.incomeTotal = getTotal(vm.incomeItems);
            getDailyBudget();
          }).then(function() {
            vm.nameIncome = '';
            vm.amountIncome = '';
          })
        } else if (type === 'expensesItems') {
          BalanceService.getBalanceData('expensesItems').then(function(response) {
            vm.expensesItems = response;
            vm.expensesTotal = getTotal(vm.expensesItems);
            getDailyBudget();
          }).then(function() {
            vm.nameExpenses = '';
            vm.amountExpenses = '';
          })
        }
      }

      function addNewBalanceItem(type, name, amount) {
        if(event.which === 13) {
          BalanceService.addNewBalanceItem(type, name, amount).then(function() {
            updateBalanceData(type);
            updateEntries();
          });
        }
      }


      /********** Settings **********/

      function toggleSettings() {
        if (vm.settingsOpen === true) {
          vm.settingsOpen = false;
        } else {
          vm.settingsOpen = true;
        }
      }

      function savePeriodDates(firstDay, lastDay) {
        SettingsService.savePeriodDates(firstDay, lastDay);
        toggleSettings();
      }

      function openCalendar(type) {
        if (type === "first") {
          vm.calendarOpened.first = true;
        } else if (type === "last") {
          vm.calendarOpened.last = true;
        }
      }


      /********** Main **********/

      function getDailyBudget() {
        var mlsecPerDay = 1000 * 60 * 60 * 24;
        var periodLength = (Math.round((vm.lastDay - vm.firstDay) / mlsecPerDay)) + 1;
        vm.dailyBudget = Math.round((vm.incomeTotal - vm.expensesTotal) / periodLength);
        return vm.dailyBudget;
      }

      function updateEntries() {
        MainService.getEntries().then(function(response) {
          vm.entries = response;
        }).then(function() {
          vm.entryDate = '';
          vm.entryDescription = '';
          vm.entryAmountSpent = '';
          getPossibleAmountToSpend();
        });
      }

      function addNewEntry(date, description, amountSpent) {
        if(event.which === 13) {
          MainService.addNewEntry(date, description, amountSpent).then(function() {
            updateEntries();
          });
        }
      }

      function getPossibleAmountToSpend() {
        if (vm.entries[0] !== undefined) {
          vm.entries[0].possibleAmountToSpend = vm.dailyBudget;
          for (var i = 1; i < vm.entries.length; i++) {
            vm.entries[i].possibleAmountToSpend = vm.entries[i-1].possibleAmountToSpend - vm.entries[i-1].amountSpent + vm.dailyBudget;
          }
        }
      }

    }]);
})();
