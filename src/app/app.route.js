(function() {
  'use strict';

  angular.module('app')
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider
        .when('/', {
          templateUrl: 'app/welcome/welcome.html',
          controller: 'WelcomeController',
          controllerAs: 'vm'
        })
        .when('/main', {
          templateUrl: 'app/main/main.html',
          controller: 'MainController',
          controllerAs: 'vm'
        });
      $routeProvider.otherwise({ redirectTo: '/' })
    }])
})();