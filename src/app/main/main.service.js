(function() {
  'use strict';

  angular.module('app.main')
    .factory('MainService', ['$location', '$http', '$q', function($location, $http, $q) {
      var currentData = {};
      var service = {
        go: go,
        getData: getData,
      };
      return service;

      //////////

      function go(path) {
        $location.path(path);
      }

      function getData() {
        var deferred = $q.defer();

        currentData = $http.get('assets/data/current-period.json').then(function(response) {
          deferred.resolve(response);
        }, function(rejection) {
          deferred.reject(rejection);
        });

        return deferred.promise;
      }

    }])
})();