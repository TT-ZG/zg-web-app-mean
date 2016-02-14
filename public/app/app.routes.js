angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

    //home is the default state
    $urlRouterProvider.otherwise('/home');

    $stateProvider

      // home state
      .state('home', {
        url: '/home',
        templateUrl: 'app/views/templates/home.html',
        controller  : 'mainController as login'
      })

      // dashboard state
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/views/templates/dashboard.html',
        controller  : 'dashController as user'
      })

      .state('dashboard.brothers', {
        url: '/brothers',
        templateUrl: 'app/views/templates/brothers.html',
        controller  : 'dashController as user'
      })

      .state('dashboard.createBrother', {
        url: '/brothers/create',
        templateUrl: 'app/views/templates/profile.html',
        controller  : 'brotherCreateController as user'
      })

      .state('dashboard.editBrother', {
        url: '/brothers/:brotherid',
        templateUrl: 'app/views/templates/profile.html',
        controller  : 'brotherEditController as user'
      })
      




});
