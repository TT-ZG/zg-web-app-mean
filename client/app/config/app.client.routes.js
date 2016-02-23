angular.module('routes').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider) {
    //Listings state providing
    $stateProvider
      .state('visitors', {
        url: '/visitors',
        abstract: true,
        templateUrl: 'app/views/visitors.html'
      })
      .state('visitors.home', {
        url: '/home',
        templateUrl: 'app/views/home.html',
      })
      .state('visitors.login', {
        url: '/login',
        templateUrl: 'app/views/login.html',
      })
      .state('brothers', {
        url: '/brothers',
        abstract: true,
        template: '<ui-view/>'
      })
      .state('brothers.list', {
        url: '',
        templateUrl: 'app/views/home.html',
      })
      .state('brothers.create', {
        url: '/create',
        templateUrl: 'app/views/home.html'
      })
      .state('brothers.view', {
        url: '/:listingId',
        templateUrl: 'app/views/home.html'
      })
     .state('brothers.edit', {
       url: '/edit?listingId',
       templateUrl: 'app/views/home.html',
     })
  }
]);
