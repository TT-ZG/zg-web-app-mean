angular.module('routes').config(['$stateProvider', '$urlRouterProvider',
  function($stateProvider) {
    //Listings state providing
    $stateProvider
      .state('main', {
        url: '',
        abstract: true,
        templateUrl: 'app/views/layout.client.view.html',
        controller  : 'mainCtrl as main'
      })
      .state('main.home', {
        url: '/home',
        templateUrl: 'app/views/home.client.view.html',
      })
      .state('main.login', {
        url: '/login',
        templateUrl: 'app/views/login.client.view.html',
      })
      .state('main.brothers', {
        url: '/brothers',
        templateUrl: 'app/views/layout.client.view.html',
        controller  : 'mainCtrl as main'
      })
      .state('main.search', {
        url: '/search',
        templateUrl: 'app/views/search.client.view.html',
        controller  : 'brotherCtrl as bro'
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
