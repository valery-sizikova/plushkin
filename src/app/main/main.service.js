(function() {
  'use strict';

  angular.module('app.main')
    .factory('MainService', ['$location', function($location) {
      var service = {
        go: go
      };
      return service;

      //////////

      function go(path) {
        $location.path(path);
      }
    }])
})();