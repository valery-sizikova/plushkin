(function() {
  'use strict';

  angular.module('app.main')
    .controller('MainController', ['$scope', '$location', 'MainService', function($scope, $location, MainService) {
      var vm = this;
      vm.go = MainService.go;
      vm.incomeTotal = false;
      vm.incomeItems = [];
      vm.expensesTotal = false;
      vm.expensesItems = [];
      vm.nameIncome = false;
      vm.amountIncome = false;
      vm.nameExpenses = false;
      vm.amountExpenses = false;
      vm.addNewBalanceItem = addNewBalanceItem;

      vm.details = false;
      vm.showDetails = showDetails;

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
      vm.dailyBudget = dailyBudget;

      activate();

      //////////

      function activate() {
        updateBalanceData('incomeItems');
        updateBalanceData('expensesItems');
      }

      function getTotal(items) {
        var total = 0;
        for (var i = 0; i < items.length; i++) {
          total += parseInt(items[i].amount);
        }
        return total;
      }

      function updateBalanceData(type) {
        if (type === 'incomeItems') {
          MainService.getBalanceData('incomeItems').then(function(response) {
            vm.incomeItems = response;
            vm.incomeTotal = getTotal(vm.incomeItems);
          }).then(function() {
            vm.nameIncome = '';
            vm.amountIncome = '';
          })
        } else if (type === 'expensesItems') {
          MainService.getBalanceData('expensesItems').then(function(response) {
            vm.expensesItems = response;
            vm.expensesTotal = getTotal(vm.expensesItems);
          }).then(function() {
            vm.nameExpenses = '';
            vm.amountExpenses = '';
          })
        }
      }

      function addNewBalanceItem(type, name, amount) {
        if(event.which === 13) {
          MainService.addNewBalanceItem(type, name, amount).then(function() {
            updateBalanceData(type);
          });
        }
      }

      function showDetails() {
        vm.details === false ? vm.details = true : vm.details = false;
      }

      function openCalendar(type) {
        if (type === "first") {
          vm.calendarOpened.first = true;
        } else if (type === "last") {
          vm.calendarOpened.last = true;
        }
      }

      function dailyBudget() {
        var mlsecPerDay = 1000 * 60 * 60 * 24;
        var periodLength = (Math.round((vm.lastDay - vm.firstDay) / mlsecPerDay)) + 1;
        return Math.round((vm.incomeTotal - vm.expensesTotal) / periodLength);
      }

    }]);
})();
