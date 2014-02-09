'use strict';

describe('Service: favoriteUrl', function () {

  // load the service's module
  beforeEach(module('mixdogeApp'));

  // instantiate service
  var favoriteUrl;
  beforeEach(inject(function (_favoriteUrl_) {
    favoriteUrl = _favoriteUrl_;
  }));

  it('should do something', function () {
    expect(!!favoriteUrl).toBe(true);
  });

});
