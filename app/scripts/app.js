'use strict';

angular.module('mixdogeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'firebase',
  'ui.bootstrap',
  'audioPlayer'
])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/login/?', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/user/:userKey/?', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/user/?', {
        templateUrl: 'views/user.html',
        controller: 'UserCtrl'
      })
      .otherwise({
        templateUrl: '404.html'
      });
  })
  .run(function($rootScope, $log, loginService) {
    $rootScope.$on('$firebaseSimpleLogin:logout', function(event) {
      $log.info('logout event ' + event);
      loginService.redirectToLogin();
    });
  })
  .run(function(soundcloudId) {
    SC.initialize({
      client_id: soundcloudId
    });
  });
