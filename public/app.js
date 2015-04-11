angular.module('justin', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
    url: '/',
    controller: 'HomeCtrl',
    templateUrl: '/templates/iapds.html'
  }).state('iapd', {
    url: '/iapd/:id',
    controller: 'IapdCtrl',
    templateUrl: '/templates/iapd.html'
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
});

