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
      vm.details = false;
      vm.showDetails = showDetails;
      vm.saveNewIncomeItem = saveNewIncomeItem;
      vm.saveNewExpensesItem = saveNewExpensesItem;
      vm.nameIncome = null;
      vm.amountIncome = null;
      vm.nameExpenses = null;
      vm.amountExpenses = null;

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
        MainService.getData().then(function(response) {
          vm.incomeItems = response.data.currentPeriod.incomeItems;
          vm.expensesItems = response.data.currentPeriod.expensesItems;
          vm.incomeTotal = getTotal(vm.incomeItems);
          vm.expensesTotal = getTotal(vm.expensesItems);
        }, function() {
          alert('Something went wrong! Please reload the app!');
        });
      }

      function getTotal(items) {
        var total = null;
        for (var i = 0; i < items.length; i++) {
          total += items[i].amount;
        }
        return total;
      }

      function showDetails() {
        vm.details === false ? vm.details = true : vm.details = false;
      }

      function saveNewIncomeItem() {
        if (event.which === 13) {
          var item = {
            name: vm.nameIncome,
            amount: vm.amountIncome
          };
          vm.incomeItems.push(item);
          vm.incomeTotal += Number(item.amount);
          vm.nameIncome = null;
          vm.amountIncome = null;
        }
      }

      function saveNewExpensesItem() {
        if (event.which === 13) {
          var item = {
            name: vm.nameExpenses,
            amount: vm.amountExpenses
          };
          vm.expensesItems.push(item);
          vm.expensesTotal += Number(item.amount);
          vm.nameExpenses = null;
          vm.amountExpenses = null;
        }
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
        var periodLength = Math.round((vm.lastDay - vm.firstDay) / mlsecPerDay);
        return Math.round((vm.incomeTotal - vm.expensesTotal) / periodLength);
      }

    }]);
})();
