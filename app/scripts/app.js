'use strict';

angular.module('ss14-team72', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase',
  'ui.bootstrap'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
