'use strict';

describe('Service: peerKey', function () {

  // load the service's module
  beforeEach(module('jukedogeApp'));

  // instantiate service
  var peerKey;
  beforeEach(inject(function (_peerKey_) {
    peerKey = _peerKey_;
  }));

  it('should do something', function () {
    expect(!!peerKey).toBe(true);
  });

});
