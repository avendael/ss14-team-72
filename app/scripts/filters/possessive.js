'use strict';

angular.module('mixdogeApp')
  .filter('possessive', function () {
    return function (input) {
      return input.substr(input.length - 1) === 's' ? input + "'" : input + "'s";
    };
  });
