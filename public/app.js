var s;

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

.controller('MainCtrl', function($scope) {
  s = $scope;
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
    r();
  });
  $http.get('/iapds/' + $stateParams.b).success(function(data) {
    $scope.b = transform(data);
    r();
  });

  function r() {
    s.title = $scope.a.name + ' vs ' + $scope.b.name;
  }

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
    if(!a.PrevRgstns){
      ret.exp = "<1"
    }else{
    if(!Array.isArray(a.PrevRgstns['PrevRgstn']))
      ret.exp = 2015 - parseInt(a.PrevRgstns['PrevRgstn']['@regBeginDt'].substring(0,4))
    else{
      ret.exp = 2015 - parseInt(a.PrevRgstns['PrevRgstn'][0]['@regBeginDt'].substring(0,4))
    }
  }
    ret.exams = a.Exms['Exm']
    if(!Array.isArray(ret.exams)){
      ret.exams = [ret.exams]
    }
    ret.exams = ret.exams.map(function(r) {
      return r['@exmNm'];
    });
    ret.DRPs = [];
    if (a.DRPs) {
      for (key in a.DRPs['DRP']) {
        if (a.DRPs['DRP'].hasOwnProperty(key)) {
          ret.DRPs.push({
            key: key.substring(1).replace(/([A-Z])/g, ' $1')
                    .replace(/^./, function(str){ return str.toUpperCase(); }),
            val: a.DRPs['DRP'][key]
          });
        }
      }
    }
    return ret;
  }
})

.controller('CompanyCtrl', function($scope, $stateParams) {
  $http.get('/companies/' + $stateParams.id).success(function(data) {
    $scope.company = data;
  });
});

