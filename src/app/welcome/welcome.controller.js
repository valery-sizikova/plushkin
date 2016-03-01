(function() {
  'use strict';

  angular.module('app.welcome')
    .controller('WelcomeController', ['$scope', '$location', 'MainService', function($scope, $location, MainService) {
      var vm = this;
      vm.wow = "it works!";
      vm.go = MainService.go;

    }]);
})();
