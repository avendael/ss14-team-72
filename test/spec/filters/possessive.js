'use strict';

describe('Filter: possessive', function () {

  // load the filter's module
  beforeEach(module('mixdogeApp'));

  // initialize a new instance of the filter before each test
  var possessive;
  beforeEach(inject(function ($filter) {
    possessive = $filter('possessive');
  }));

  it('should return the input prefixed with "possessive filter:"', function () {
    var text = 'angularjs';
    expect(possessive(text)).toBe('possessive filter: ' + text);
  });

});
