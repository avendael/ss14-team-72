'use strict';

describe('Service: playlistUrl', function () {

  // load the service's module
  beforeEach(module('jukedogeApp'));

  // instantiate service
  var playlistUrl;
  beforeEach(inject(function (_playlistUrl_) {
    playlistUrl = _playlistUrl_;
  }));

  it('should do something', function () {
    expect(!!playlistUrl).toBe(true);
  });

});
