'use strict';

angular.module('jukedogeApp')
  .controller(
    'LoginCtrl',
    function ($scope, $location, $firebaseSimpleLogin, $log, firebaseUrl, loginService) {
      $scope.onLoginGithub = function() {
        loginService.loginGithub();
      };
  });
