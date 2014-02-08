'use strict';

angular.module('jukedogeApp')
  .controller(
    'LoginCtrl',
    function ($scope, $location, $firebaseSimpleLogin, $log, firebaseUrl, loginService) {
      // $scope.loginService = $firebaseSimpleLogin(new Firebase(firebaseUrl));

      $scope.onLoginGithub = function() {
        loginService.loginGithub(function success(user) {
          $location.path('/');
        }, function fail(error) {
          alert('login failed ' + JSON.stringify(error));
        });
        // $scope.loginService.$login('github').then(function success(user) {
        //   $log.info('github login successful');
        //   $location.path('/');
        // }, function fail(error) {
        //   alert('login failed  ' + JSON.stringify(error));
        // });
      };
  });
