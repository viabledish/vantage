'use strict';

angular.module('vantageApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.items = [];
    $scope.chartData = [];
    $scope.chartConfig = {};

  var getItems = function() {
    $http.jsonp('http://api.nytimes.com/svc/elections/us/v3/finances/2008/president/totals.json?api-key=85c32d59cd9256167606de14f60ebe95:11:20721543&callback=JSON_CALLBACK').success(function (data) {
      $scope.items = data;
    });
  };

  getItems();

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

  $scope.candidateReceipts = function () {
		var cd = [];
		var names = [];
		for (var i = 0; i < $scope.items.results.length; i++) {
				var receipt = []
				receipt = parseInt($scope.items.results[i].total_receipts);
				cd.push(receipt);
				names.push($scope.items.results[i].candidate_name);
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
});
