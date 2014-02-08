'use strict';

angular.module('jukedogeApp')
  .controller(
    'MainCtrl',
    function ($scope, $firebase, $log, firebaseUrl, loginService) {
      var firebase = new Firebase(firebaseUrl);

      $scope.firebase = $firebase(firebase);

      $scope.logout = function() {
        loginService.logout();
      };

      // Wrap everything in checkLogin because the user must be logged in.
      loginService.checkLogin(function success(user) {
        $log.info('the user is ' + JSON.stringify(user));
      });
    });
