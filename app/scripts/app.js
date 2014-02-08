'use strict';

angular.module('jukedogeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase',
  'ui.bootstrap'
])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        templateUrl: '404.html'
        // redirectTo: '/'
      });
  })
  .run(function($rootScope, $log, loginService) {
    $rootScope.$on('$firebaseSimpleLogin:logout', function(event) {
      $log.info('logout event ' + event);
      loginService.redirectToLogin();
    });
  });
