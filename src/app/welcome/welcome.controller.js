(function() {
  'use strict';

  angular.module('app.welcome')
    .controller('WelcomeController', ['$scope', '$location', 'MainService', function($scope, $location, MainService) {
      var vm = this;
      vm.go = MainService.go;

    }]);
})();
