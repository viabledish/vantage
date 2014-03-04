'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('vantageApp', 'candidateSearch'));

  var nytCandidateSearchJSON = {
          status: "OK", 
          copyright: "Copyright (c) 2014 The New York Times Company. All Rights Reserved.", 
          results: [{candidate_id: "P80003338",
          candidate_name: "Obama, Barack",
          cash_on_hand: "29911984.0",
          cash_on_hand_party_rank: 1,
          committee_id: "C00431445",
          contribution_size_note: null,
          contributions_200_499: "69883814.0",
          contributions_200_499_party_rank: 1,
          contributions_500_1499: "115620433.3",
          contributions_500_1499_party_rank: 1,
          contributions_1500_2499: "18924824.06",
          contributions_1500_2499_party_rank: 1,
          contributions_less_than_200_party_rank: 1,
          contributions_max: "98960776.0",
          contributions_max_party_rank: 1,
          date_coverage_from: "2007-01-01",
          date_coverage_to: "2008-11-24",
          federal_funds: "0.0",
          geographic_note: null,
          individual_contributions: "662225678.0",
          name: "Barack Obama",
          net_candidate_contributions: "0.0",
          net_general_contributions: "175021403.4",
          net_individual_contributions: "656610810.0",
          net_pac_contributions: "1580.0",
          net_party_contributions: "850.0",
          net_primary_contributions: "-145109419.4",
          net_primary_party_rank: null,
          party: "D",
          summary_note: null,
          total_contributions: "662239758.0",
          total_contributions_less_than_200: "291502143.5",
          total_contributions_max: "98960776.0",
          total_disbursements: "740557859.5",
          total_disbursements_party_rank: 1,
          total_receipts: "770469844.0",
          total_receipts_party_rank: 1,
          total_refunds: "5626510.54",
          transfers_in: "83450000.0",
          weekly_note: null}]
        };

    var nytPresCampJSON = {
                          status: "OK", 
                          copyright: "Copyright (c) 2014 The New York Times Company. All Rights Reserved.", 
                          results: [{hashKey: "006",
                          candidate_id: "P80003338",
                          candidate_name: "Obama, Barack",
                          cash_on_hand: "29911984.0",
                          committee: "committees/C00431445.json",
                          committee_id: "C00431445",
                          date_coverage_from: "2007-01-01",
                          date_coverage_to: "2008-11-24",
                          name: "Barack Obama",
                          party: "D",
                          total_disbursements: "740557859.5",
                          total_receipts: "770469844.0"},
                          {hashKey: "007",
                          candidate_id: "P80002801",
                          candidate_name: "McCain, John",
                          cash_on_hand: "32812513.75",
                          committee: "committees/C00430470.json",
                          committee_id: "C00430470",
                          date_coverage_from: "2006-10-01",
                          date_coverage_to: "2008-11-24",
                          name: "John McCain",
                          party: "R",
                          total_disbursements: "362567196.7",
                          total_receipts: "395379707.1"}]};

  var MainCtrl,
    scope;

  var $httpBackend;

  var defaultJSON;

  var nytPresCamp = 'http://api.nytimes.com/svc/elections/us/v3/finances/2008/president/totals.json?api-key=85c32d59cd9256167606de14f60ebe95:11:20721543&callback=JSON_CALLBACK';
  var nytCandidateSearch = 'http://api.nytimes.com/svc/elections/us/v3/finances/2008/president/candidates/obama.json?query=&api-key=85c32d59cd9256167606de14f60ebe95:11:20721543&callback=JSON_CALLBACK';
  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $injector, defaultJSON) {
    // Set up the mock http service responses
    $httpBackend = $injector.get('$httpBackend');

    defaultJSON = defaultJSON;
    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
    });
    
    //Deal with the initial call to the NYTimes API
    $httpBackend.whenJSONP(nytPresCamp).respond(nytPresCampJSON);
    $httpBackend.expectJSONP(nytPresCamp);
    $httpBackend.flush();
  }));

  it('should have a MainCtrl controller defined', function() {
    expect(MainCtrl).toBeDefined();
  });

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });

  describe('getItems function', function () {
    beforeEach(function() {
      spyOn(scope, 'getItems').andCallThrough();
    });
    it('should call NYTIMES api', function () {
      $httpBackend.whenJSONP(nytPresCamp).respond(nytPresCampJSON);
      $httpBackend.expectJSONP(nytPresCamp);
      scope.getItems();
      $httpBackend.flush();
      expect(scope.items).toEqual(nytPresCampJSON);
    });
  });

  describe('partySpend function', function () {
    it('should be defined', function () {
      expect(scope.partySpend).toBeDefined();
    });
    it('should call function pieChartConfig with the appropriate arguments', function () {
      spyOn(scope, 'partySpend').andCallThrough();
      spyOn(scope, 'pieChartConfig').andCallThrough();
      scope.partySpend(nytPresCampJSON);
      expect(scope.pieChartConfig).toHaveBeenCalledWith('pie', [['Democrats',770469844],['Republicans', 395379707]], 'Party Spend', 'US 2008 Campaign Spend by Party');
    });
  });

  describe('candidateReceipts function', function () {
    it('should be defined', function () {
      expect(scope.candidateReceipts).toBeDefined();
    });
    it('should call function barChartConfig with the appropriate arguments', function () {
      spyOn(scope, 'candidateReceipts').andCallThrough();
      spyOn(scope, 'barChartConfig').andCallThrough();
      scope.candidateReceipts(nytPresCampJSON.results);
      expect(scope.barChartConfig).toHaveBeenCalledWith('bar',[770469844, 395379707], ['Obama, Barack', 'McCain, John'], 'US 2008 Campaign Total Receipts by Candidate');
    });
  });

  describe('candidateSearch function', function () {
    beforeEach(function() {
      spyOn(scope, 'candidateSearch').andCallThrough();
    });
    it('should be defined', function () {
      expect(scope.candidateSearch).toBeDefined();
    });
    it('should be called with the appropriate arguments', function () {
      var lname = 'Obama';
      scope.candidateSearch(lname);
      expect(scope.candidateSearch).toHaveBeenCalled();
    });
    it('should assign scope.candidateResult appropriately', function () {
      $httpBackend.whenJSONP(nytCandidateSearch).respond(nytCandidateSearchJSON);
      $httpBackend.expectJSONP(nytCandidateSearch);
      var lname = 'obama';
      scope.candidateSearch(lname);
      $httpBackend.flush();
      expect(scope.candidateResult).toEqual([{candidate_id: 'P80003338', total_contributions: '662239758.0', total_receipts_party_rank: 1}]);
    });
  });
});