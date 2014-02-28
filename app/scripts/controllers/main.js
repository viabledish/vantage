'use strict';

angular.module('vantageApp')
  .controller('MainCtrl', function ($scope, $http, $filter, $modal) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.items = [];
    $scope.chartData = [];
    $scope.chartConfig = {};

    $scope.candidateResult = [];
    $scope.candidateDefs = 
                  [{ field: 'candidate_id', displayName: 'Candidate ID', width: "150"},
                   { field: 'total_contributions', displayName: 'Total Contributions', width: "150" },
                   { field: 'total_receipts_party_rank', displayName: 'Party rank (total receipts)', width: "200" }];
    $scope.gridOptions = { data: 'candidateResult', columnDefs: 'candidateDefs' };

    $scope.oneAtATime = false;

    var getItems = function() {
      $http.jsonp('http://api.nytimes.com/svc/elections/us/v3/finances/2008/president/totals.json?api-key=85c32d59cd9256167606de14f60ebe95:11:20721543&callback=JSON_CALLBACK').success(function (data) {
        $scope.items = data;
      });
    };

    getItems();

    // watch the expression, and update the UI on change.
    $scope.$watch('candidateFilter', function () {
      $scope.candidateReceipts($scope.filteredItems);
    }, true);

    $scope.partySpend = function () {
      var demSpend = 0;
      var repubSpend= 0;

      for (var i = 0; i < $scope.items.results.length; i++) {
        if ($scope.items.results[i].party == "D") {
          demSpend += parseInt($scope.items.results[i].total_receipts);
        } else {
          repubSpend += parseInt($scope.items.results[i].total_receipts);
        }
      }

  		var totalSpend = [['Democrats',demSpend],['Republicans', repubSpend]]
      
      $scope.chartConfig = {
        options: {
            chart: {
                type: 'pie'
            }
        },
        series: [{
            data: totalSpend,
            name: 'Party Spend'
        }],
        title: {
        	text: 'US 2008 Campaign Spend by Party'
    		},
    		plotOptions: {
          pie: {
              allowPointSelect: true,
              cursor: 'pointer',
          }
    		},	
        loading: false
      }
    };

    $scope.candidateReceipts = function (data) {
  		var cd = [];
  		var names = [];
  		
      for (var i = 0; i < data.length; i++) {
  				var receipt = []
  				receipt = parseInt(data[i].total_receipts);
  				cd.push(receipt);
  				names.push(data[i].candidate_name);
      }

      $scope.chartConfig = {
        options: {
            chart: {
                type: 'bar'
            }
        },
        series: [{
            data: cd,
        }],
        xAxis: {
      		categories: names, 
        	},
          title: {
              text: 'US 2008 Campaign Total Receipts by Candidate'
          },

        loading: false
      }  
    };

    $scope.candidateSearch = function(name) {
      var lname = name.split(',', 1);
      $http.jsonp('http://api.nytimes.com/svc/elections/us/v3/finances/2008/president/candidates/' 
        + lname + '.json?query=&api-key=85c32d59cd9256167606de14f60ebe95:11:20721543&callback=JSON_CALLBACK').success(function (data) {
        var candidateData = {};
        candidateData.candidate_id = data.results[0].candidate_id
        candidateData.total_contributions = data.results[0].total_contributions
        candidateData.total_receipts_party_rank = data.results[0].total_receipts_party_rank
        $scope.candidateResult = [candidateData];
      });
    };
});