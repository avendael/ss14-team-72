'use strict';

angular.module('jukedogeApp')
  .controller('LoginCtrl', function ($scope, loginService) {
      $scope.onLoginGithub = function() {
        loginService.loginGithub();
      };
  });
