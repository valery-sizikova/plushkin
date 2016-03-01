(function() {
  'use strict';

  angular.module('app.main')
    .controller('MainController', ['$scope', '$location', 'MainService', function($scope, $location, MainService) {
      var vm = this;
      vm.go = MainService.go;
    }]);
})();
