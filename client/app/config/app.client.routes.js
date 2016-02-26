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
      .state('main.search', {
        url: '/search',
        templateUrl: 'app/views/search.client.view.html',
        controller  : 'brotherCtrl as search'
      })
      .state('main.create', {
        url: '/brothers/create',
        templateUrl: 'app/views/profile.client.view.html',
        controller  : 'createCtrl as modify'
      })
      .state('main.edit', {
        url: '/brothers/:brotherid',
        templateUrl: 'app/views/profile.client.view.html',
        controller  : 'editCtrl as modify'
      })




      /*
      // ===========================================
      // create brother nested view
      .state('dashboard.createBrother', {
        url: '/brothers/create',
        templateUrl: 'app/views/templates/profile.html',
        controller  : 'brotherCreateController as user'
      })

      // ===========================================
      // edit brother nested view
      .state('dashboard.editBrother', {
        url: '/brothers/:brotherid',
        templateUrl: 'app/views/templates/profile.html',
        controller  : 'brotherEditController as user'
      });*/
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
