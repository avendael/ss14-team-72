'use strict';

describe('Service: Loginservice', function () {

  // load the service's module
  beforeEach(module('jukedogeApp'));

  // instantiate service
  var Loginservice;
  beforeEach(inject(function (_Loginservice_) {
    Loginservice = _Loginservice_;
  }));

  it('should do something', function () {
    expect(!!Loginservice).toBe(true);
  });

});
