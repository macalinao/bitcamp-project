angular.module('justin', ['ui.router', 'ui.bootstrap'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl',
    templateUrl: '/templates/home.html'
  }).state('iapd', {
    url: '/iapd/:id',
    controller: 'IapdCtrl',
    templateUrl: '/templates/iapd.html'
  }).state('company', {
    url: '/company/:id',
    controller: 'CompanyCtrl',
    templateUrl: '/templates/company.html'

  }).state('compare', {
    url: '/compare/:a/:b',
    controller: 'CompareCtrl',
    templateUrl: '/templates/compare.html'
  });

  $urlRouterProvider.otherwise('/');
})

.controller('HomeCtrl', function($scope, $http) {
  $scope.iapds = [];
  $http.get('/iapds').success(function(data) {
    $scope.iapds = data;
  });
})

.controller('IapdCtrl', function($scope, $stateParams) {
  $http.get('/iapds/' + $stateParams.id).success(function(data) {
    $scope.iapd = data;
  });
})

.controller('CompareCtrl', function($scope, $stateParams) {
  $http.get('/iapds/' + $stateParams.a).success(function(data) {
    $scope.a = data;
  });
  $http.get('/iapds/' + $stateParams.b).success(function(data) {
    $scope.b = data;
  });
})

.controller('CompanyCtrl', function($scope, $stateParams) {
  $http.get('/companies/' + $stateParams.id).success(function(data) {
    $scope.company = data;
  });
});

