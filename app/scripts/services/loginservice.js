'use strict';

angular.module('jukedogeApp')
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

      return loginService;
    });
