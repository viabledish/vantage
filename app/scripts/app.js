'use strict';

angular.module('vantageApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'highcharts-ng',
  'ui.bootstrap'
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
