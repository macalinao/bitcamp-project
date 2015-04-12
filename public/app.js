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

.controller('HomeCtrl', function($scope, $http, $location) {
  $scope.advisor = {};
  $scope.advisorIds = {};

  $scope.advisors = [];
  $http.get('/iapds').success(function(data) {
    $scope.advisors = data;
  });

  $scope.onSelectA = function(item) {
    $scope.advisorIds.a = item._id;
  };

  $scope.onSelectB = function(item) {
    $scope.advisorIds.b = item._id;
  };

  $scope.compare = function() {
    if (!$scope.advisorIds.a || !$scope.advisorIds.b) return;
    $location.url('/compare/' + $scope.advisorIds.a + '/' + $scope.advisorIds.b);
  };
})

.controller('IapdCtrl', function($scope, $stateParams) {
  $http.get('/iapds/' + $stateParams.id).success(function(data) {
    $scope.iapd = data;
  });
})

.controller('CompareCtrl', function($scope, $stateParams, $http) {
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

