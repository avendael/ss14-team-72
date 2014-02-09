'use strict';

angular.module('mixdogeApp')
  .controller(
    'UserCtrl',
    function ($scope, $firebase, $log, firebaseUrl, loginService) {
      $scope.logout = function() {
        loginService.logout();
      };

      // Wrap everything in checkLogin because the user must be logged in.
      loginService.checkLogin(function success(user) {
        $scope.firebase = $firebase(new Firebase(firebaseUrl));
      });
    });
