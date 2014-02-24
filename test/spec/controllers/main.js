'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('vantageApp'));

  var MainCtrl,
    scope;

  var $httpBackend;

  var nytUrl = 'http://api.nytimes.com/svc/elections/us/v3/finances/2008/president/totals.json?api-key=85c32d59cd9256167606de14f60ebe95:11:20721543&callback=JSON_CALLBACK';

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');
    // backend definition common for all tests
    $httpBackend.whenJSONP(nytUrl).respond({nytString: 'success'}, {data: ['a','b']});
    
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
    });
  }));

  it('should have a MainCtrl controller defined', function() {
    expect(MainCtrl).toBeDefined();
  });

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });

  it('should successfully call NYTIMES api', function () {
    $httpBackend.expectJSONP(nytUrl).respond(200, '');
  });

  describe('partySpend function', function () {
    it('should be defined', function () {
      expect(scope.partySpend).toBeDefined();
    });
    it('should have the chart series populated', function () {
      spyOn(scope, 'partySpend');
      scope.partySpend();
      expect(scope.partySpend).toHaveBeenCalled();
    });
  });

  describe('candidateReceipts function', function () {
    it('should be defined', function () {
      expect(scope.candidateReceipts).toBeDefined();
    });
    it('should to have the chart series populated', function () {
      spyOn(scope, 'candidateReceipts');
      scope.candidateReceipts();
      expect(scope.candidateReceipts).toHaveBeenCalled();
    });
  });
});
