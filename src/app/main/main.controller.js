(function() {
  'use strict';

  angular.module('app.main')
    .controller('MainController', ['$scope', '$location', '$filter', 'MainService', 'BalanceService', 'SettingsService', function($scope, $location, $filter, MainService, BalanceService, SettingsService) {
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
      vm.dailyExpensesTotal = false;

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
      vm.entryDate = new Date();
      vm.entryDescription = false;
      vm.entryAmountSpent = false;
      vm.getPossibleAmountToSpend = getPossibleAmountToSpend;

      activate();

      //////////

      function activate() {
        SettingsService.getPeriodDates().then(function(response) {
          if (response !== undefined) {
            vm.firstDay = response.firstDay;
            vm.lastDay = response.lastDay;
          }
        });
        updateBalanceData('incomeItems');
        updateBalanceData('expensesItems');
        updateEntries();
      }


      /********** Balance **********/

      function getTotalBalance(items) {
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
            vm.incomeTotal = getTotalBalance(vm.incomeItems);
            getDailyBudget();
          }).then(function() {
            vm.nameIncome = '';
            vm.amountIncome = '';
          })
        } else if (type === 'expensesItems') {
          BalanceService.getBalanceData('expensesItems').then(function(response) {
            vm.expensesItems = response;
            vm.expensesTotal = getTotalBalance(vm.expensesItems);
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

      function getTotalDailyExpenses(items) {
        var total = 0;
        for (var i = 0; i < items.length; i++) {
          total += parseInt(items[i].amountSpent);
        }
        return total;
      }

      function getDailyBudget() {
        var periodLength = moment(vm.lastDay).diff(moment(vm.firstDay), 'days') + 1;
        vm.dailyBudget = Math.round((vm.incomeTotal - vm.expensesTotal) / periodLength);
        return vm.dailyBudget;
      }

      function updateEntries() {
        MainService.getEntries().then(function(response) {
          vm.entries = response;
          vm.dailyExpensesTotal = getTotalDailyExpenses(vm.entries);
        }).then(function() {
          if (vm.entries.length === 0) {
            var temp = new Date(vm.firstDay);
            vm.entryDate = $filter('date')(temp, 'dd MMM');
          } else {
            var temp = new Date(vm.entries[vm.entries.length - 1].date);
            temp.setDate(temp.getDate() + 1);
            vm.entryDate = $filter('date')(temp, 'dd MMM');
          }
          vm.entryDescription = '';
          vm.entryAmountSpent = '';
          getPossibleAmountToSpend();
        });
      }

      function addNewEntry(date, description, amountSpent) {
        if(event.which === 13) {
          var amountSpentTotal = Math.round(eval(amountSpent));
          MainService.addNewEntry(date, description, amountSpentTotal).then(function() {
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
