'use strict';

angular.module('vantageApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'highcharts-ng'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
