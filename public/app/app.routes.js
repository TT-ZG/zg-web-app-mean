angular.module('app.routes', ['ui.router'])

.config(function($stateProvider, $urlRouterProvider) {

    //home is the default state
    $urlRouterProvider.otherwise('/home');

    $stateProvider

      // home state
      .state('home', {
        url: '/home',
        templateUrl: 'app/views/templates/user/home.html',
        controller  : 'mainController as login'
      })

      // dashboard state
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'app/views/templates/brother/dashboard.html',
        controller  : 'dashController as dash'
      })

      .state('dashboard.list', {
      url: '/admin',
      templateUrl: 'app/views/templates/brother/adminList.html',
      controller  : 'dashController as user'
    });

});
