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
    it('should call function pieChartConfig with the appropriate arguments', function () {
      var jsonResponse = { results: [{'candidate_name': 'Barack Obama', 'total_receipts': 10, 'party': 'D'}, {'candidate_name': 'John McCain', 'total_receipts': 5, 'party': 'R'}] };
      spyOn(scope, 'partySpend').andCallThrough();
      spyOn(scope, 'pieChartConfig').andCallThrough();
      scope.partySpend(jsonResponse);
      expect(scope.pieChartConfig).toHaveBeenCalledWith('pie', [['Democrats',10],['Republicans', 5]], 'Party Spend', 'US 2008 Campaign Spend by Party');
    });
  });

  describe('candidateReceipts function', function () {
    it('should be defined', function () {
      expect(scope.candidateReceipts).toBeDefined();
    });
    it('should call function barChartConfig with the appropriate arguments', function () {
      var jsonResponse = [{'candidate_name': 'Barack Obama', 'total_receipts': 10, 'party': 'D'}, {'candidate_name': 'John McCain', 'total_receipts': 5, 'party': 'R'}];
      spyOn(scope, 'candidateReceipts').andCallThrough();
      spyOn(scope, 'barChartConfig').andCallThrough();
      scope.candidateReceipts(jsonResponse);
      expect(scope.barChartConfig).toHaveBeenCalledWith('bar',[10, 5], ['Barack Obama', 'John McCain'], 'US 2008 Campaign Total Receipts by Candidate');
    });
  });

  describe('candidateSearch function', function () {
    it('should be defined', function () {
      expect(scope.candidateSearch).toBeDefined();
    });
    it('should be called with the appropriate arguments', function () {
      var lname = 'Obama';
      spyOn(scope, 'candidateSearch').andCallThrough();
      scope.candidateSearch(lname);
      expect(scope.candidateSearch).toHaveBeenCalled();
    });
    it('should assign scope.candidateResult appropriately', function () {
      var lname = 'Obama';
      //var data = [{candidateId: 'P80003338', totalContributions: '100', partyRank: 1}];
      spyOn(scope, 'candidateSearch').andCallThrough();
      spyOn(scope, 'candidateResult');
      scope.candidateSearch(lname);
      expect(scope.candidateResult).toBeDefined();
      //not entirely sure how to test that candidateResult was assigne properly
    });
  });
});
