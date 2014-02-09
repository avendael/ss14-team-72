'use strict';

angular.module('mixdogeApp')
  .controller('LoginCtrl', function ($scope, $log, loginService) {
    loginService.checkLogin(function success() {
      loginService.redirectToMain();
    }, function error() {
      // noop. We're already here
    });

    doge([
      'static',
      'showdown',
      'doge',
      'music',
      'mixtape',
      'playlist',
      'awesome',
      'angular',
      'firebase',
      'bootstrap',
      'animate.css',
      'soundcloud'
    ], true);

    $scope.onLoginGithub = function() {
      loginService.loginGithub(null, function(error) {
        alert(error);
      });
    };

    $scope.onLoginTwitter = function() {
      loginService.loginTwitter(null, function(err0r) {
        alert(error);
      });
    };

    $scope.onLoginGuest = function() {
      loginService.loginGuest(null, function(error) {
        alert(error);
      });
    };
  });
