'use strict';

describe('Service: soundcloudId', function () {

  // load the service's module
  beforeEach(module('jukedogeApp'));

  // instantiate service
  var soundcloudId;
  beforeEach(inject(function (_soundcloudId_) {
    soundcloudId = _soundcloudId_;
  }));

  it('should do something', function () {
    expect(!!soundcloudId).toBe(true);
  });

});
