angular.module('routes').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider) {
    //Listings state providing
    $stateProvider
      .state('visitors', {
        url: '/visitors',
        abstract: true,
        templateUrl: 'app/views/layout.client.view.html',
        controller  : 'mainCtrl as main'
      })
      .state('visitors.home', {
        url: '/home',
        templateUrl: 'app/views/home.client.view.html',
      })
      .state('visitors.login', {
        url: '/login',
        templateUrl: 'app/views/login.client.view.html',
      })
      .state('brothers', {
        url: '/brothers',
        abstract: true,
        templateUrl: 'app/views/layout.client.view.html',
        controller  : 'mainCtrl as main'
      })
      .state('brothers.search', {
        url: '/search',
        templateUrl: 'app/views/search.client.view.html',
      })

      /*
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
     })*/
  }
]);
