(function() {
  'use strict';

  angular.module('app.main')
    .controller('MainController', ['$scope', '$location', 'MainService', function($scope, $location, MainService) {
      var vm = this;
      vm.go = MainService.go;
      vm.incomeTotal = false;
      vm.incomeItems = [
        {
          name: "tax return",
          amount: 1000
        },
        {
          name: "salary",
          amount: 2000
        },
        {
          name: "bonus",
          amount: 3000
        }
      ];
      vm.expensesTotal = false;
      vm.expensesItems = [
        {
          name: "mortgage",
          amount: 1000
        },
        {
          name: "electricity bill",
          amount: 200
        },
        {
          name: "insurance",
          amount: 150
        }
      ];
      vm.details = false;
      vm.showDetails = showDetails;
      vm.saveNewIncomeItem = saveNewIncomeItem;
      vm.saveNewExpensesItem = saveNewExpensesItem;
      vm.nameIncome = null;
      vm.amountIncome = null;
      vm.nameExpenses = null;
      vm.amountExpenses = null;

      activate();

      //////////

      function activate() {
        vm.incomeTotal = getTotal(vm.incomeItems);
        vm.expensesTotal = getTotal(vm.expensesItems);
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

    }]);
})();
