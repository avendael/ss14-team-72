'use strict';

angular.module('mixdogeApp')
  .service(
    'loginService',
    function loginService($firebaseSimpleLogin, $location, firebaseUrl) {
      // AngularJS will instantiate a singleton by calling "new" on this function
      var firebase = new Firebase(firebaseUrl),
          loginService = $firebaseSimpleLogin(firebase);

      /**
       * Redirect to the login page.
       */
      loginService.redirectToLogin = function() {
        $location.path('/login');
      };

      /**
       * Redirect to the main page.
       */
      loginService.redirectToMain = function() {
        $location.path('/');
      };

      /**
       * Checks if a user is currently logged in. If there's no user logged in, run
       * the error callback.
       *
       * @param {Function} the success callback.
       * @param {Function} the fail callback.
       */
      loginService.checkLogin = function(success, error) {
        loginService.$getCurrentUser().then(function(user) {
          if (user === null) !!error ? error() : loginService.redirectToLogin();
          else if (!!success) success(user);
        });
      };

      /**
       * Firebase login using Github OAuth.
       *
       * @param {Function} the success callback
       * @param {Function} the fail callback
       */
      loginService.loginGithub = function(success, fail) {
        loginService.$login('github').then(function(user) {
          if (!!success) success(user);
          else loginService.redirectToMain();
        }, function(error) {
          if (!!fail) fail(error);
          else loginService.redirectToLogin();
        });
      };

      loginService.loginGuest = function(success, fail) {
        loginService.$login('password', {
          email: 'guest@ss14-team-72.firebaseapp.com',
          password: 'guest'
        }).then(function(user) {
          if (!!success) success(user);
          else loginService.redirectToMain();
        }, function(error) {
          if (!!fail) fail(error);
          else loginService.redirectToLogin();
        });
      };
      /**
       * An alias for loginService.$logout. Watch for the '$firebaseSimpleLogin:logout'
       * event to execute a callback after this runs.
       */
      loginService.logout = function() {
        loginService.$logout();
      };

      return loginService;
    });
