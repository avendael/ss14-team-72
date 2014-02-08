'use strict';

angular.module('mixdogeApp')
  .controller('LoginCtrl', function ($scope, loginService) {
    loginService.checkLogin(function success() {
      loginService.redirectToMain();
    }, function error() {
      // noop. We're already here
    });

    $scope.onLoginGithub = function() {
      loginService.loginGithub();
    };
  });
