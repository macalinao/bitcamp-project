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
    $scope.a = transform(data);
  });
  $http.get('/iapds/' + $stateParams.b).success(function(data) {
    $scope.b = transform(data);
  });

  function transform(a) {
    var ret = {};
    ret.name = a.Info['@firstNm'] + ' ' + a.Info['@lastNm'];
    ret.rating = a.score;
    ret.employer = a.CrntEmps['CrntEmp']['@orgNm'];
    ret.regs = a.CrntEmps['CrntEmp']['CrntRgstns']['CrntRgstn'];
    if (!Array.isArray(ret.regs)) {
      ret.regs = [ret.regs];
    }
    ret.regs = ret.regs.map(function(r) {
      return r['@regAuth'];
    });

    return ret;
  }
})

.controller('CompanyCtrl', function($scope, $stateParams) {
  $http.get('/companies/' + $stateParams.id).success(function(data) {
    $scope.company = data;
  });
});

