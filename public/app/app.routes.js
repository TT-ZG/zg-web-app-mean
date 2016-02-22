angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

    // ===========================================
    // home is the default state
    $urlRouterProvider.otherwise('/home');

    $stateProvider

      // ===========================================
      // home state
      .state('home', {
        url: '/home',
        templateUrl: 'app/views/templates/home.html',
        controller  : 'loginController as login'
      })

      // ===========================================
      // dashboard state
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/views/templates/dashboard.html',
        controller  : 'dashController as user'
      })

      // ===========================================
      // brothers nested view
      .state('dashboard.brothers', {
        url: '/brothers',
        templateUrl: 'app/views/templates/brothers.html',
        controller  : 'dashController as user'
      })

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
      });

      //Enable HTML5 which rids us of octothorps
      $locationProvider.html5Mode(true);

      //Set a default route
      $urlRouterProvider.otherwise('/home');
});
